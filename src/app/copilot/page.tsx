"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield,
  ArrowLeft,
  Settings,
  Volume2,
  Mic,
  Maximize2,
  Layers,
  Trash2,
  Upload,
  ChevronDown,
  Check,
  Play,
  Square,
  Lock,
  Unlock,
  Sparkles,
  Home,
  History,
  LogOut,
  User,
  Save,
  Loader2,
  Briefcase,
  FileText,
  UploadCloud,
  Mail
} from "lucide-react";
import Link from "next/link";
import mammoth from "mammoth";

interface STTResult {
  text: string;
  is_final: boolean;
}

interface ITranscriptTurn {
  sender: "interviewer" | "candidate" | "copilot";
  text: string;
  timestamp: Date;
}

export default function CopilotPage() {
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  function setCookie(name: string, value: string, days = 7) {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }

  // Credentials and Config (persisted locally)
  const [deepgramKey, setDeepgramKey] = useState("");
  const [llmKey, setLlmKey] = useState("");
  const [activeLlmProvider, setActiveLlmProvider] = useState("openai");
  const [opacity, setOpacity] = useState(0.85);

  // Pre-Interview Context Setup States
  const [interviewRole, setInterviewRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [candidateResume, setCandidateResume] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  // Key Validation States
  const [deepgramKeyStatus, setDeepgramKeyStatus] = useState<'idle' | 'verified' | 'failed'>('idle');
  const [llmProviderStatus, setLlmProviderStatus] = useState<'idle' | 'verified' | 'failed'>('idle');

  // App States
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Audio & Stream Buffers
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [latency, setLatency] = useState<number | null>(null);

  // Audio toggles
  const [captureMic, setCaptureMic] = useState(true);
  const [captureSystem, setCaptureSystem] = useState(true);

  // Audio engine nodes references
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const systemStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Web socket reference
  const wsRef = useRef<WebSocket | null>(null);

  // Timing and request references
  const speechStartRef = useRef<number | null>(null);
  const activeRequestIdRef = useRef<number>(0);
  const voiceBufferRef = useRef("");
  const voiceDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceSegmentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastPromptRef = useRef("");
  const lastRequestTypeRef = useRef<'normal' | 'screen_capture'>('normal');

  // Draggable HUD coordinates
  const [hudPosition, setHudPosition] = useState({ x: 20, y: 20 });
  const hudRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Conversation history & sliding drawer
  const [history, setHistory] = useState<ITranscriptTurn[]>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Auth User state
  const [user, setUser] = useState<{ email: string; credits: number; is_subscribed: boolean } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const lastSavedHistoryLengthRef = useRef(0);
  const sessionStartRef = useRef<number | null>(null);
  const sttStartRef = useRef<number | null>(null);
  const accumulatedSttTimeRef = useRef<number>(0);

  const [sessionId, setSessionId] = useState("");
  const sessionIdRef = useRef(sessionId);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const interviewRoleRef = useRef(interviewRole);
  useEffect(() => {
    interviewRoleRef.current = interviewRole;
  }, [interviewRole]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (historyRef.current.length > 0 && historyRef.current.length !== lastSavedHistoryLengthRef.current && tokenRef.current) {
        const totalTime = sessionStartRef.current ? Math.round((Date.now() - sessionStartRef.current) / 1000) : 0;
        const totalSttOnTime = Math.round(accumulatedSttTimeRef.current + (sttStartRef.current ? (Date.now() - sttStartRef.current) / 1000 : 0));
        
        const body = JSON.stringify({
          role: interviewRoleRef.current,
          company: "General Interview Session",
          transcript: historyRef.current.map(t => ({
            sender: t.sender,
            text: t.text,
            timestamp: t.timestamp
          })),
          sessionId: sessionIdRef.current,
          totalTime,
          totalSttOnTime
        });

        lastSavedHistoryLengthRef.current = historyRef.current.length;

        fetch("/api/interviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenRef.current}`
          },
          body,
          keepalive: true
        }).catch(err => console.error("Keepalive auto-save failed:", err));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Login Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Load configuration from cookies
  useEffect(() => {
    setInterviewRole(getCookie("ctl_interview_role") || "");
    setJobDescription(getCookie("ctl_job_description") || "");
    setCandidateResume(getCookie("ctl_candidate_resume") || "");
    setResumeFileName(getCookie("ctl_resume_file_name") || "");

    const storedToken = getCookie("ctl_token");
    const storedUser = getCookie("ctl_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Synchronize with backend profile to load premium config keys
  useEffect(() => {
    if (token) {
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.config?.deepgram_api_key) {
            setDeepgramKey(data.config.deepgram_api_key);
            setDeepgramKeyStatus('verified');
            setLlmKey("server");
            setLlmProviderStatus('verified');
            setActiveLlmProvider("openai");
          } else {
            setDeepgramKey("");
            setDeepgramKeyStatus('idle');
            setLlmKey("");
            setLlmProviderStatus('idle');
          }
          if (data.user) {
            setUser(data.user);
            setCookie("ctl_user", JSON.stringify(data.user));
          }
        })
        .catch(() => { });
    } else {
      setDeepgramKey("");
      setDeepgramKeyStatus('idle');
      setLlmKey("");
      setLlmProviderStatus('idle');
    }
  }, [token]);

  // Save configurations on changes
  useEffect(() => {
    setCookie("ctl_interview_role", interviewRole);
  }, [interviewRole]);

  useEffect(() => {
    setCookie("ctl_job_description", jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    setCookie("ctl_candidate_resume", candidateResume);
  }, [candidateResume]);

  useEffect(() => {
    setCookie("ctl_resume_file_name", resumeFileName);
  }, [resumeFileName]);

  // Handle resume parsing
  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setStatus(`Parsing: ${file.name}...`);

    try {
      const arrayBuffer = await file.arrayBuffer();
      let extractedText = "";
      if (file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (file.name.endsWith(".pdf")) {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }
        extractedText = text;
      } else {
        setStatus("Unsupported format");
        return;
      }
      setCandidateResume(extractedText);
      setStatus("Resume parsed successfully!");
    } catch (err: any) {
      console.error(err);
      setStatus(`Parse Failed: ${err.message || err}`);
    }
  }

  // Linear downsampler to 16kHz
  function downsample(input: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array {
    if (fromSampleRate === toSampleRate) {
      return input;
    }
    const ratio = fromSampleRate / toSampleRate;
    const outputLength = Math.round(input.length / ratio);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const idx = Math.floor(i * ratio);
      output[i] = input[idx];
    }
    return output;
  }

  // Convert Float32Array into 16-bit PCM bytes
  function convertFloat32To16BitPCM(input: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }

  // Start direct-in-browser capture engine
  async function startCaptureEngine() {
    if (isCapturing) return;

    if (historyRef.current.length > 0) {
      await saveInterviewSession();
      setHistory([]);
      lastSavedHistoryLengthRef.current = 0;
      sessionStartRef.current = null;
      accumulatedSttTimeRef.current = 0;
      sttStartRef.current = null;
    }

    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
    }
    sttStartRef.current = Date.now();

    const newSessionId = typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);

    setStatus("Initializing audio context...");
    setTranscript("");
    setAnswer("");
    setLatency(null);
    speechStartRef.current = null;
    voiceBufferRef.current = "";

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      let micStream: MediaStream | null = null;
      let systemStream: MediaStream | null = null;

      // 1. Capture Microphone
      if (captureMic) {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = micStream;
      }

      // 2. Capture System loopback (Display media audio share)
      if (captureSystem) {
        try {
          systemStream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: 1, height: 1 }, // Request minimal video to pass browser constraints
            audio: true
          });
          systemStreamRef.current = systemStream;
        } catch (err) {
          console.warn("System capture cancelled or blocked. Proceeding with microphone only.", err);
          setCaptureSystem(false);
        }
      }

      const micHasAudio = micStream && micStream.getAudioTracks().length > 0;
      const systemHasAudio = systemStream && systemStream.getAudioTracks().length > 0;

      if (!micHasAudio && !systemHasAudio) {
        if (captureSystem && (!systemStream || systemStream.getAudioTracks().length === 0)) {
          throw new Error("No audio tracks captured. When sharing screen/tab, you MUST check the 'Share audio' box in the browser prompt.");
        }
        throw new Error("No active audio capture sources found (check microphone permissions).");
      }

      // Create Web Audio Node Graph
      const merger = audioCtx.createChannelMerger(2);
      let micConnected = false;
      let systemConnected = false;

      if (micHasAudio) {
        const micSource = audioCtx.createMediaStreamSource(micStream!);
        micSource.connect(merger, 0, 0); // Microphone to input channel 0 (Left)
        micConnected = true;
      }

      if (systemHasAudio) {
        const systemSource = audioCtx.createMediaStreamSource(systemStream!);
        systemSource.connect(merger, 0, 1); // System Loopback to input channel 1 (Right)
        systemConnected = true;
      }

      // Processor node to downsample to 16kHz stereo (2 input, 2 output) PCM
      const processor = audioCtx.createScriptProcessor(4096, 2, 2);
      processorRef.current = processor;

      // Analyser node for rendering waveform on canvas
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      if (micConnected || systemConnected) {
        merger.connect(processor);
      } else {
        throw new Error("Failed to connect audio sources to Web Audio graph");
      }

      processor.connect(analyser);
      analyser.connect(audioCtx.destination); // Required to pull audio through script processor

      // Ensure AudioContext is fully running
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // Connect WebSocket to Deepgram with channels=2 and multichannel=true
      const dgUrl = "wss://api.deepgram.com/v1/listen?model=nova-3&encoding=linear16&sample_rate=16000&channels=2&multichannel=true&interim_results=true&punctuate=true&endpointing=300";
      console.log("[STT] Connecting to Deepgram Multichannel WebSocket...");
      const ws = new WebSocket(dgUrl, ["token", deepgramKey.trim()]);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[STT] Deepgram Multichannel WebSocket Connected!");
        setStatus("Listening...");
        setIsCapturing(true);
      };

      ws.onerror = (e) => {
        console.error("[STT] Deepgram connection error:", e);
        setStatus("STT Connection Error");
      };

      ws.onclose = () => {
        console.log("[STT] Deepgram connection closed.");
        stopCaptureEngine();
      };

      ws.onmessage = (event) => {
        try {
          const json = JSON.parse(event.data);
          const is_final = json.is_final;
          const text = json.channel?.alternatives?.[0]?.transcript || "";
          const cleanText = text.trim();

          if (!cleanText) return;

          // channel_index[0]: 0 = candidate (Mic), 1 = interviewer (System loopback)
          const channelIndex = json.channel_index ? json.channel_index[0] : 0;
          console.log(`[STT EVENT] Ch ${channelIndex}: "${cleanText}" | is_final: ${is_final}`);

          if (voiceDebounceTimeoutRef.current) {
            clearTimeout(voiceDebounceTimeoutRef.current);
            voiceDebounceTimeoutRef.current = null;
          }
          if (voiceSegmentTimeoutRef.current) {
            clearTimeout(voiceSegmentTimeoutRef.current);
            voiceSegmentTimeoutRef.current = null;
          }

          if (is_final) {
            // Label sender for transcript history log
            const senderName = channelIndex === 0 ? "candidate" : "interviewer";
            const label = channelIndex === 0 ? "You: " : "Interviewer: ";

            // Set finalized view text
            setTranscript(label + cleanText);
            setInterimTranscript("");

            // Add turn to conversational history log
            setHistory((prev) => [
              ...prev,
              { sender: senderName, text: cleanText, timestamp: new Date() }
            ]);

            // ONLY trigger LLM if speaker is the Interviewer (Channel 1)
            if (channelIndex === 1) {
              const fullQuery = cleanText;
              const wordCount = fullQuery.split(/\s+/).filter(Boolean).length;
              const isLikelyQuestion =
                fullQuery.endsWith("?") ||
                wordCount >= 4 ||
                (fullQuery.length >= 15 && (
                  fullQuery.toLowerCase().includes("describe") ||
                  fullQuery.toLowerCase().includes("explain") ||
                  fullQuery.toLowerCase().includes("tell me") ||
                  fullQuery.toLowerCase().includes("how") ||
                  fullQuery.toLowerCase().includes("what") ||
                  fullQuery.toLowerCase().includes("why")
                ));

              if (isLikelyQuestion) {
                triggerLLM(fullQuery);
              } else {
                console.log(`[STT INTERVIEWER] Ignored non-question turn: "${fullQuery}"`);
              }
            } else {
              console.log("[STT CANDIDATE] Candidate voice transcript recorded silently. Skipping LLM call.");
            }
          } else {
            const label = channelIndex === 0 ? "You: " : "Interviewer: ";
            setInterimTranscript(label + cleanText);
          }
        } catch (err) {
          console.error("[STT] Error parsing WebSocket message:", err);
        }
      };

      // Audio Processing loop (keeping microphone on Left, system audio on Right)
      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        const left = e.inputBuffer.getChannelData(0); // Mic
        const right = e.inputBuffer.getChannelData(1); // System Speaker Loopback

        // Downsample each channel independently
        const resampledLeft = downsample(left, audioCtx.sampleRate, 16000);
        const resampledRight = downsample(right, audioCtx.sampleRate, 16000);

        // Interleave downsampled channels for 2-channel linear16 PCM
        const interleaved = new Float32Array(resampledLeft.length * 2);
        for (let i = 0; i < resampledLeft.length; i++) {
          interleaved[i * 2] = resampledLeft[i];          // Left channel = Candidate Mic
          interleaved[i * 2 + 1] = resampledRight[i];      // Right channel = Interviewer Speaker
        }

        const pcmBytes = convertFloat32To16BitPCM(interleaved);
        ws.send(pcmBytes);
      };

      startWaveformRender(analyser);

    } catch (err: any) {
      console.error("[CAPTURE ERROR]", err);
      setStatus(`Capture Error: ${err.message || err}`);
      stopCaptureEngine();
    }
  }

  // Stop direct browser capture
  async function stopCaptureEngine() {
    console.log("[CAPTURE] Stopping audio engine...");

    if (sttStartRef.current) {
      accumulatedSttTimeRef.current += (Date.now() - sttStartRef.current) / 1000;
      sttStartRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (systemStreamRef.current) {
      systemStreamRef.current.getTracks().forEach((track) => track.stop());
      systemStreamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (voiceDebounceTimeoutRef.current) {
      clearTimeout(voiceDebounceTimeoutRef.current);
      voiceDebounceTimeoutRef.current = null;
    }
    if (voiceSegmentTimeoutRef.current) {
      clearTimeout(voiceSegmentTimeoutRef.current);
      voiceSegmentTimeoutRef.current = null;
    }

    setIsCapturing(false);
    setStatus("");

    await saveInterviewSession();
  }

  // Trigger stateless CORS proxy completion stream
  async function triggerLLM(
    promptText: string,
    requestType: 'normal' | 'screen_capture' | 'regeneration' = 'normal',
    previousAnswer?: string
  ) {
    const authHeaderToken = getCookie("ctl_token");
    if (!authHeaderToken) {
      setStatus("Error: Authentication Required");
      alert("Please log in to authorize Copilot completions and credit checks.");
      return;
    }

    if (requestType !== "regeneration") {
      lastPromptRef.current = promptText;
      lastRequestTypeRef.current = requestType as 'normal' | 'screen_capture';
    }

    setAnswer("");
    setStatus("Streaming Copilot...");
    speechStartRef.current = Date.now();

    const currentRequestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = currentRequestId;

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authHeaderToken}`,
        },
        body: JSON.stringify({
          provider: activeLlmProvider,
          prompt: promptText,
          apiKey: llmKey.trim(),
          role: interviewRole,
          jobDescription: jobDescription || null,
          candidateResume: candidateResume || null,
          history: history.map(h => ({ sender: h.sender, text: h.text })),
          sessionId: sessionId || null,
          requestType: requestType,
          previousAnswer: previousAnswer || null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let finalAnswer = "";

      while (true) {
        if (activeRequestIdRef.current !== currentRequestId) {
          console.log(`[LLM] Aborted older completion stream ${currentRequestId}`);
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const pos = buffer.indexOf("\n");
          if (pos === -1) break;

          const line = buffer.substring(0, pos).trim();
          buffer = buffer.substring(pos + 1);

          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (jsonStr === "[DONE]") break;

            try {
              const json = JSON.parse(jsonStr);
              let token = "";

              switch (activeLlmProvider) {
                case "groq":
                case "openai":
                case "xai":
                  token = json.choices?.[0]?.delta?.content || "";
                  break;
                case "anthropic":
                  if (json.type === "content_block_delta") {
                    token = json.delta?.text || "";
                  }
                  break;
                case "gemini":
                  token = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  break;
              }

              if (token) {
                finalAnswer += token;
                setAnswer(finalAnswer);

                if (speechStartRef.current) {
                  const delta = (Date.now() - speechStartRef.current) / 1000;
                  setLatency(Number(delta.toFixed(2)));
                }
              }
            } catch (e) {
              // Ignore parse errors on incomplete JSON chunks
            }
          }
        }
      }

      setStatus("Copilot ready");

      // Once response is fully compiled, save it into our history log
      if (finalAnswer) {
        if (requestType === "regeneration") {
          setHistory((prev) => {
            const nextHistory = [...prev];
            for (let i = nextHistory.length - 1; i >= 0; i--) {
              if (nextHistory[i].sender === "copilot") {
                nextHistory[i] = { ...nextHistory[i], text: finalAnswer, timestamp: new Date() };
                return nextHistory;
              }
            }
            return [...nextHistory, { sender: "copilot", text: finalAnswer, timestamp: new Date() }];
          });
        } else {
          setHistory((prev) => [
            ...prev,
            { sender: "copilot", text: finalAnswer, timestamp: new Date() }
          ]);
        }

        // Deduct 1 credit locally for instant updates
        if (user) {
          const updatedUser = { ...user, credits: Math.max(0, user.credits - 1) };
          setUser(updatedUser);
          localStorage.setItem("ctl_user", JSON.stringify(updatedUser));
          document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`LLM Error: ${err.message || err}`);
    }
  }

  async function handleRegenerateResponse() {
    if (!lastPromptRef.current) return;
    setStatus("Streaming Copilot...");
    await triggerLLM(lastPromptRef.current, "regeneration", answer);
  }

  // Draw Audio Waveform on Canvas
  function startWaveformRender(analyser: AnalyserNode) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isCapturing && !audioContextRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#F8F9FB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;

      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, "#E8503A"); // Coral
      grad.addColorStop(0.5, "#6366F1"); // Indigo
      grad.addColorStop(1, "#3B82F6"); // Blue
      ctx.strokeStyle = grad;

      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }

  // Toggle capturing stream
  async function handleToggleCapture() {
    if (isCapturing) {
      stopCaptureEngine();
    } else {
      if (!interviewRole.trim()) {
        setStatus("Error: Interview Role is required");
        return;
      }
      if (!deepgramKey.trim()) {
        setStatus("Error: Deepgram Key missing");
        return;
      }
      if (!llmKey.trim()) {
        setStatus(`Error: ${activeLlmProvider.toUpperCase()} Key missing`);
        return;
      }
      await startCaptureEngine();
    }
  }

  // Clear Console / Chat
  function handleClearChat() {
    setTranscript("");
    setInterimTranscript("");
    setAnswer("");
    setLatency(null);
    speechStartRef.current = null;
    voiceBufferRef.current = "";
    if (voiceDebounceTimeoutRef.current) {
      clearTimeout(voiceDebounceTimeoutRef.current);
      voiceDebounceTimeoutRef.current = null;
    }
    if (voiceSegmentTimeoutRef.current) {
      clearTimeout(voiceSegmentTimeoutRef.current);
      voiceSegmentTimeoutRef.current = null;
    }
    setHistory([]);
    lastSavedHistoryLengthRef.current = 0;
    setStatus(isCapturing ? "Console Cleared (Listening)" : "Console Cleared");
  }

  // Handle Dragging of the floating HUD card
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (isLocked) return;
    dragStartRef.current = {
      x: e.clientX - hudPosition.x,
      y: e.clientY - hudPosition.y
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStartRef.current) return;
      setHudPosition({
        x: event.clientX - dragStartRef.current.x,
        y: event.clientY - dragStartRef.current.y
      });
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  // Toggle Overlay (Floating HUD Mode)
  function handleToggleOverlay() {
    const nextOverlay = !isOverlayMode;
    setIsOverlayMode(nextOverlay);
    setIsLocked(false);
    if (nextOverlay) {
      setStatus("Overlay Unlocked");
      if (!isCapturing) {
        startCaptureEngine();
      }
    } else {
      setStatus("Dashboard");
      stopCaptureEngine();
    }
  }

  // Hot toggles
  async function handleToggleMic() {
    const nextMic = !captureMic;
    setCaptureMic(nextMic);
    if (isCapturing) {
      stopCaptureEngine();
      setTimeout(startCaptureEngine, 200);
    }
  }

  async function handleToggleSystem() {
    const nextSystem = !captureSystem;
    setCaptureSystem(nextSystem);
    if (isCapturing) {
      stopCaptureEngine();
      setTimeout(startCaptureEngine, 200);
    }
  }

  async function saveInterviewSession() {
    if (historyRef.current.length === 0 || historyRef.current.length === lastSavedHistoryLengthRef.current) {
      return;
    }

    const savedToken = getCookie("ctl_token") || tokenRef.current;
    if (!savedToken) {
      return;
    }

    const totalTime = sessionStartRef.current ? Math.round((Date.now() - sessionStartRef.current) / 1000) : 0;
    const totalSttOnTime = Math.round(accumulatedSttTimeRef.current + (sttStartRef.current ? (Date.now() - sttStartRef.current) / 1000 : 0));

    lastSavedHistoryLengthRef.current = historyRef.current.length;
    setStatus("Saving session...");
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`
        },
        body: JSON.stringify({
          role: interviewRoleRef.current,
          company: "General Interview Session",
          transcript: historyRef.current.map(t => ({
            sender: t.sender,
            text: t.text,
            timestamp: t.timestamp
          })),
          sessionId: sessionIdRef.current,
          totalTime,
          totalSttOnTime
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to save session");

      setStatus("Session Saved");
      setTimeout(() => {
        setStatus(prev => prev === "Session Saved" ? "" : prev);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      lastSavedHistoryLengthRef.current = 0;
      setStatus("Save Error");
      setTimeout(() => {
        setStatus(prev => prev === "Save Error" ? "" : prev);
      }, 3500);
    }
  }

  async function handlePasswordAuth() {
    setLoadingLogin(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          name: authMode === "signup" ? signupName : undefined,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Authentication failed");

      setCookie("ctl_token", data.token);
      setCookie("ctl_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLoginModal(false);
      alert(authMode === "signup" ? "Account created and logged in!" : "Signed in successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingLogin(false);
    }
  }

  // Handle Logout
  function handleLogout() {
    deleteCookie("ctl_token");
    deleteCookie("ctl_user");
    setToken(null);
    setUser(null);
    alert("Logged out successfully.");
  }

  const renderProviderLogo = (provider: string) => {
    const size = "w-4 h-4";
    switch (provider) {
      case "openai":
        return (
          <svg className={`${size} text-emerald-400`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.73 10.24c.08-.26.12-.54.12-.82 0-.9-.55-1.72-1.37-2.07-.15-.06-.32-.1-.48-.12.03-.23.04-.47.02-.7-.07-.94-.85-1.7-1.79-1.77-.18-.01-.36.01-.54.04-.15-.43-.45-.8-.85-1.04a2.38 2.38 0 00-2.65.18c-.14.1-.26.22-.36.35-.35-.22-.76-.34-1.18-.34-.97 0-1.83.63-2.12 1.55-.17-.06-.35-.1-.53-.12A2.398 2.398 0 008.2 6.55c-.01.18.01.36.04.53-.43.15-.8.45-1.04.85a2.38 2.38 0 00.18 2.65c.1.14.22.26.35.36-.22.35-.34.76-.34 1.18 0 .97.63 1.83 1.55 2.12-.06.17-.1.35-.12.53a2.398 2.398 0 001.13 2.18c.18.01.36-.01.53-.04.15.43.45.8.85 1.04a2.38 2.38 0 002.65-.18c.14-.1.26-.22.36-.35.35.22.76.34 1.18.34.97 0 1.83-.63 2.12-1.55.17.06.35.1.53.12a2.398 2.398 0 002.18-1.13c.01-.18-.01-.36-.04-.53.43-.15.8-.45 1.04-.85a2.38 2.38 0 00-.18-2.65c-.09-.14-.21-.26-.34-.36.21-.35.33-.76.33-1.18zm-8.83 8.35c-.2-.04-.39-.12-.55-.25l-4.48-2.59c-.43-.25-.6-.79-.35-1.22.15-.26.41-.42.7-.45l3.29-.12.01-.01c.21.05.44.02.63-.09l4.57-2.64c.43-.25.98-.1 1.23.33.17.3.15.68-.06.96L14.7 17.51c-.26.4-.73.61-1.2.53c-.2.03-.4.01-.6-.05zm-3.13-2.18c-.1-.17-.15-.36-.15-.56V10.6c0-.5.33-.94.81-1.07.28-.08.57-.02.8.14l2.84 1.64c.2.11.33.32.33.55v5.27c0 .5-.33.94-.81 1.07-.28.08-.57.02-.8-.14l-2.84-1.64c-.11-.2-.17-.4-.2-.61z" />
          </svg>
        );
      case "anthropic":
        return (
          <svg className={`${size} text-amber-500`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h4l2.5-5.5h7L18 22h4L12 2zm-2.5 12L12 7.8l2.5 6.2h-5z" />
          </svg>
        );
      case "gemini":
        return (
          <svg className={`${size} text-blue-500`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
          </svg>
        );
      case "groq":
        return (
          <svg className={`${size} text-teal-400`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 1.93-.72 3.68-1.9 5.03z" />
          </svg>
        );
      case "xai":
        return (
          <svg className={`${size} text-slate-300`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.9 3h-2.24L12 9.54 7.34 3H5.1L10.9 11.2 5 21h2.24L12 14.46l4.66 6.54h2.24L13.1 12.8 18.9 3z" />
          </svg>
        );
      default:
        return (
          <Settings className={`${size} text-slate-400`} />
        );
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-(--bg-mist) p-2 relative overflow-hidden select-none">

      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--accent)/3 blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/3 blur-[120px] pointer-events-none select-none"></div>

      {/* Floating overlay hud card (rendered on toggle overlay) */}
      {isOverlayMode && (
        <div
          ref={hudRef}
          style={{
            transform: `translate(${hudPosition.x}px, ${hudPosition.y}px)`,
            background: `rgba(255, 255, 255, ${opacity})`,
            zIndex: 100
          }}
          className={`absolute top-0 left-0 w-[800px] h-[520px] rounded-[24px] p-5 flex flex-col gap-4 animate-fade-in text-slate-800 transition-all duration-300 shadow-2xl backdrop-blur-md ${isLocked
              ? "border border-(--border-light) pointer-events-none"
              : `border-2 border-dashed ${
                  activeLlmProvider === "openai" ? "border-emerald-500/40" :
                  activeLlmProvider === "anthropic" ? "border-amber-500/40" :
                  activeLlmProvider === "gemini" ? "border-blue-500/40" :
                  activeLlmProvider === "groq" ? "border-teal-500/40" :
                  "border-slate-300"
                } pointer-events-auto`
            }`}
        >
          {/* HUD Drag Header */}
          <div
            onMouseDown={handleMouseDown}
            className={`flex justify-between items-center border-b border-slate-100 pb-3 select-none z-30 ${isLocked ? "cursor-default" : "cursor-move"}`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${activeLlmProvider === "openai" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,163,127,0.3)]" :
                  activeLlmProvider === "anthropic" ? "bg-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.3)]" :
                    activeLlmProvider === "gemini" ? "bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]" :
                      activeLlmProvider === "groq" ? "bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]" :
                        "bg-slate-400"
                }`}></span>
              <span className="text-[10px] font-black tracking-widest uppercase select-none text-(--accent)">
                WEB HUD OVERLAY
              </span>
            </div>

            {/* Custom Control Actions */}
            <div className="flex items-center gap-2 pointer-events-auto">

              {!isLocked && (
                <button
                  onClick={handleToggleCapture}
                  className={`text-[11px] px-2 py-1 rounded-lg font-black transition active:scale-95 cursor-pointer flex items-center gap-1 border ${isCapturing
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                      : "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
                    }`}
                >
                  {isCapturing ? "⏹ Stop" : "▶ Start"}
                </button>
              )}

              {!isLocked && (
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-lg text-[10px]">
                  <button
                    onClick={handleToggleMic}
                    className={`px-1.5 py-0.5 rounded transition cursor-pointer font-bold ${captureMic ? "bg-sky-50 text-sky-700 border border-sky-200" : "text-slate-400 font-medium"
                      }`}
                  >
                    🎤 {captureMic ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={handleToggleSystem}
                    className={`px-1.5 py-0.5 rounded transition cursor-pointer font-bold ${captureSystem ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "text-slate-400 font-medium"
                      }`}
                  >
                    🔊 {captureSystem ? "ON" : "OFF"}
                  </button>
                </div>
              )}

              {!isLocked && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg text-[10px]">
                  <span className="text-slate-500 font-medium">Opacity:</span>
                  <input
                    type="range"
                    min="0.15"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-14 h-1 bg-slate-200 accent-(--accent) rounded-lg cursor-pointer"
                  />
                  <span className="text-slate-600 font-bold w-5 text-right">{Math.round(opacity * 100)}%</span>
                </div>
              )}

              {!isLocked && (
                <button
                  onClick={() => setShowHistoryDrawer(true)}
                  className="text-[11px] px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-black border border-sky-200 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </button>
              )}

              {!isLocked && (
                <button
                  onClick={handleClearChat}
                  className="text-[11px] px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black border border-rose-200 rounded-lg transition active:scale-95 cursor-pointer"
                >
                  🧹 Clear
                </button>
              )}

              {isLocked ? (
                <button
                  onClick={() => setIsLocked(false)}
                  className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-slate-100"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  Unlock
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLocked(true);
                    setStatus("HUD Locked");
                  }}
                  className="text-[11px] px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-black border border-sky-200 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Lock
                </button>
              )}

              {!isLocked && (
                <button
                  onClick={() => {
                    setIsOverlayMode(false);
                    setIsLocked(false);
                    setStatus("Dashboard");
                    stopCaptureEngine();
                  }}
                  className="text-[10px] px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-black transition active:scale-95 cursor-pointer text-slate-600"
                >
                  Exit HUD
                </button>
              )}
            </div>
          </div>

          {/* Real-time Transcription Stream */}
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              Live Audio Transcription Feed
            </span>
            <div className="text-[14px] text-slate-800 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 h-[90px] overflow-y-auto leading-relaxed scrollbar-thin shadow-inner select-text pointer-events-auto">
              {transcript || interimTranscript ? (
                <p className="font-medium select-text">
                  {transcript}
                  <span className="text-(--accent) font-bold italic">{interimTranscript ? ` ${interimTranscript}...` : ""}</span>
                </p>
              ) : (
                <span className="text-slate-400 italic text-xs select-none">Waiting for live conversation speech stream...</span>
              )}
            </div>
          </div>

          {/* AI Copilot Answer Panel */}
          <div className="flex flex-col gap-1.5 flex-1 min-h-0 z-10">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-slate-800">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeLlmProvider === "openai" ? "bg-emerald-500" :
                    activeLlmProvider === "anthropic" ? "bg-amber-500" :
                      activeLlmProvider === "gemini" ? "bg-blue-500" :
                        activeLlmProvider === "groq" ? "bg-teal-500" :
                          "bg-slate-400"
                  }`}></span>
                AI Copilot Guidance
              </span>
              <div className="flex items-center gap-2 select-none pointer-events-auto">
                {answer && status !== "Streaming Copilot..." && (
                  <button
                    onClick={handleRegenerateResponse}
                    className="text-[10.5px] px-2.5 py-0.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-black border border-sky-500/35 rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                    title="Regenerate last response with more detailed instructions"
                  >
                    🔁 Regenerate
                  </button>
                )}
                {latency && (
                  <span className="text-[10px] text-slate-400 font-bold bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-lg shadow-sm">
                    Latency: {latency}s
                  </span>
                )}
              </div>
            </div>
            <div className={`flex-1 text-[16px] p-5 rounded-2xl border overflow-y-auto font-semibold leading-relaxed scrollbar-thin select-text pointer-events-auto ${
              activeLlmProvider === "openai" ? "bg-emerald-50/15 border-emerald-200 text-emerald-950" :
              activeLlmProvider === "anthropic" ? "bg-amber-50/15 border-amber-200 text-amber-950" :
              activeLlmProvider === "gemini" ? "bg-blue-50/15 border-blue-200 text-blue-950" :
              activeLlmProvider === "groq" ? "bg-teal-50/15 border-teal-200 text-teal-950" :
              "bg-slate-50 border-slate-200 text-slate-800"
            }`}>
              {answer ? (
                <div className="whitespace-pre-wrap leading-relaxed select-text font-bold text-slate-800 animate-fade-in pointer-events-auto">
                  {answer}
                  {status === "Streaming Copilot..." && (
                    <span className={`inline-block w-2.5 h-4.5 ml-1.5 animate-pulse align-middle ${activeLlmProvider === "openai" ? "bg-emerald-500" :
                        activeLlmProvider === "anthropic" ? "bg-amber-500" :
                          activeLlmProvider === "gemini" ? "bg-blue-500" :
                            activeLlmProvider === "groq" ? "bg-teal-500" :
                              "bg-slate-400"
                      }`}></span>
                  )}
                </div>
              ) : (
                <div className="h-full flex justify-center items-center select-none">
                  <span className="text-slate-400 italic text-sm">Awaiting interview questions to generate real-time feedback...</span>
                </div>
              )}
            </div>
          </div>

          {/* Evasion / Shield Footer */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-100 select-none z-10">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-600/90">
              <Shield className="w-4 h-4 text-emerald-600" />
              Direct Browser Tab Streaming Affinity Protected
            </span>
            {status && (
              <span className="font-extrabold uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">{status}</span>
            )}
          </div>
        </div>
      )}

      {/* Main dashboard configuration panel */}
      {!isOverlayMode && (
        <div
          style={{ background: `rgba(255, 255, 255, ${opacity})` }}
          className={`glass-light w-[780px] h-[670px] rounded-3xl p-7 flex flex-col justify-between text-slate-800 border-2 relative overflow-hidden shadow-2xl animate-fade-in backdrop-blur-md transition-all duration-300 ${
            activeLlmProvider === "openai" ? "border-emerald-500/20 shadow-emerald-500/5" :
            activeLlmProvider === "anthropic" ? "border-amber-500/20 shadow-amber-500/5" :
            activeLlmProvider === "gemini" ? "border-blue-500/20 shadow-blue-500/5" :
            "border-teal-500/20 shadow-teal-500/5"
          }`}
        >
          {/* Subtle glowing orbs */}
          <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-(--accent)/3 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[220px] h-[220px] bg-indigo-500/3 rounded-full blur-[90px] pointer-events-none"></div>

          {/* Header */}
          <div className="flex justify-between items-center relative z-10 select-none">
            <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition cursor-pointer">
              <img src="/logo.png" className="h-11 w-auto select-none object-contain" alt="Logo" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                  Crack<span className="text-gradient-coral font-black">TheLoop</span> <span className="text-[10px] font-bold bg-(--accent-soft) text-(--accent) border border-(--accent)/15 px-2 py-0.5 rounded-md tracking-widest uppercase">WEB v2.0</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Anti-Share Stealth Browser Audio Copilot</p>
              </div>
            </Link>

            {/* Authenticated user status vs Login controls */}
            <div className="flex items-center gap-2 relative z-20">
              {user ? (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 pl-3.5 pr-1.5 py-1 rounded-full text-xs font-bold shadow-xs">
                  <span className="text-slate-600 font-bold truncate max-w-[120px]">{user.email}</span>
                  <span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-[10px]">
                    {user.credits} credits
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition cursor-pointer border border-slate-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLoginEmail("");
                    setLoginPassword("");
                    setSignupName("");
                    setAuthMode("signin");
                    setShowLoginModal(true);
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white border border-sky-500/20 px-4 py-1.5 rounded-full text-xs font-black transition active:scale-95 cursor-pointer uppercase tracking-wider shadow-xs"
                >
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Sign In
                </button>
              )}

              {status && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold shadow-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCapturing ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10a37f]" : "bg-slate-200"}`}></span>
                  <span className="text-slate-700 font-bold uppercase tracking-wider">{status}</span>
                </div>
              )}
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex justify-center items-center border border-slate-200 font-black transition active:scale-90 cursor-pointer"
                title="Go to User Dashboard"
              >
                <Layers className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex justify-center items-center border border-slate-200 font-black transition active:scale-90 cursor-pointer"
                title="Go Back to Home Landing"
              >
                <Home className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {/* Credits Warning Banner */}
          {user && (user.credits || 0) < 10 && (
            <div className="bg-rose-50 border border-rose-200 px-4 py-3.5 rounded-2xl relative z-10 text-xs text-rose-600 font-bold text-center">
              ⚠️ Insufficient Fuel: You need at least 10 credits to run the AI Copilot. Your current balance is {user.credits} credits. Please purchase a plan or refill on the account dashboard.
            </div>
          )}

          {/* Pre-Interview Context Setup Widget */}
          <div className="flex flex-col gap-3.5 bg-white border border-(--border-light) p-5 rounded-2xl relative z-10 shadow-xs">
            <span className="text-[10px] text-slate-450 font-black uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2.5 select-none">
              💼 Pre-Interview Context Setup
              {!interviewRole.trim() && (
                <span className="text-[9px] px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded animate-pulse font-black uppercase tracking-wider">
                  Interview Role Required
                </span>
              )}
              {interviewRole.trim() && (
                <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-black uppercase tracking-wider">
                  Ready
                </span>
              )}
            </span>

            <div className="flex flex-col gap-3.5 mt-0.5">
              {/* Row 1: Mandatory Interview Role & Model Provider Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    Interview Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={interviewRole}
                      onChange={(e) => setInterviewRole(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className={`w-full bg-slate-50/60 border ${!interviewRole.trim() ? "border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.05)]" : "border-slate-200"
                        } px-3.5 py-2 pl-10 rounded-xl text-xs focus:outline-none focus:border-(--accent) focus:bg-white focus:ring-4 focus:ring-(--accent)/5 transition-all duration-300 placeholder-slate-400 text-slate-800 font-semibold`}
                    />
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    AI Copilot Model Engine
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["openai", "anthropic", "gemini", "groq"] as const).map((prov) => {
                      const isSelected = activeLlmProvider === prov;
                      const details = {
                        openai: { label: "GPT-4o", desc: "Balanced", logo: "🟢" },
                        anthropic: { label: "Claude", desc: "Coding", logo: "🟠" },
                        gemini: { label: "Gemini", desc: "Context", logo: "🔵" },
                        groq: { label: "Llama", desc: "Latency", logo: "⚡" },
                      }[prov];
                      
                      return (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => {
                            setActiveLlmProvider(prov);
                            setLlmKey("server");
                            setLlmProviderStatus("verified");
                          }}
                          className={`py-1.5 px-1 rounded-xl border text-center flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? prov === "openai" ? "bg-emerald-50/50 border-emerald-500 shadow-xs scale-102" :
                                prov === "anthropic" ? "bg-amber-50/50 border-amber-500 shadow-xs scale-102" :
                                prov === "gemini" ? "bg-blue-50/50 border-blue-500 shadow-xs scale-102" :
                                "bg-teal-50/50 border-teal-500 shadow-xs scale-102"
                              : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 hover:border-slate-350"
                          }`}
                        >
                          <span className="text-xs">{details.logo}</span>
                          <span className="text-[9px] font-black text-slate-800 tracking-tight leading-none mt-1">{details.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 2: Job Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Job Description (Optional)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste target job details, requirements, or tech stack..."
                    className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 pl-10 text-xs placeholder-slate-400 scrollbar-thin h-[55px] min-h-[55px] max-h-[55px] focus:outline-none focus:border-(--accent) focus:bg-white focus:ring-4 focus:ring-(--accent)/5 transition-all duration-300 text-slate-800 font-semibold"
                  />
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Row 3: Resume Uploader */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Resume File (Optional)
                </label>
                {!resumeFileName ? (
                  <label className="flex flex-col items-center justify-center border border-dashed border-slate-200 hover:border-(--accent) hover:bg-(--accent-soft)/10 bg-slate-50/60 rounded-xl p-2 cursor-pointer select-none transition-all duration-300 group h-[52px] shadow-xs">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4.5 h-4.5 text-slate-400 group-hover:text-(--accent) transition duration-300" />
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider group-hover:text-slate-700 transition">Upload Resume PDF or DOCX</span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-200 px-4 py-1.5 rounded-xl text-xs text-emerald-800 font-bold shadow-xs animate-fade-in relative overflow-hidden group h-[52px]">
                    <div className="flex items-center gap-2.5 relative z-10">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-700 font-extrabold truncate w-[260px]">{resumeFileName}</span>
                        <span className="text-[8px] text-emerald-700 font-bold uppercase tracking-widest mt-0.5">Extraction Active</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeFileName("");
                        setCandidateResume("");
                      }}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-[8.5px] font-black text-rose-600 transition active:scale-90 cursor-pointer relative z-10 uppercase tracking-wider"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Waveform Visualizer & Audio Source Panel */}
          <div className="flex justify-between items-center bg-white border border-(--border-light) px-4 py-2.5 rounded-2xl relative z-10 text-xs gap-4 shadow-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider select-none shrink-0 text-slate-400 text-[10px]">
              Waveform:
            </div>

            {/* Visual Waveform Canvas */}
            <div className="flex-1 h-9 bg-slate-950/90 rounded-xl overflow-hidden border border-slate-900 shadow-inner shrink min-w-0">
              <canvas ref={canvasRef} width="320" height="36" className="w-full h-full opacity-85" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition border cursor-pointer ${captureMic
                    ? "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100/80 shadow-xs"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {captureMic ? "Mic ON" : "Mic Muted"}
              </button>

              {/* System Toggle Button */}
              <button
                type="button"
                onClick={handleToggleSystem}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition border cursor-pointer ${captureSystem
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80 shadow-xs"
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }`}
                title="Captures shared Chrome/Edge tab audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {captureSystem ? "Tab Audio ON" : "Tab Muted"}
              </button>
            </div>
          </div>

          {/* Action Panel */}
          <div className="flex gap-4 relative z-10">
            <button
              onClick={handleToggleOverlay}
              disabled={!interviewRole.trim() || !deepgramKey.trim() || !llmKey.trim() || !token}
              className={`w-full py-3.5 bg-gradient-to-r ${
                activeLlmProvider === "openai" ? "from-emerald-600 to-teal-650 shadow-emerald-600/10" :
                activeLlmProvider === "anthropic" ? "from-amber-600 to-orange-650 shadow-orange-600/10" :
                activeLlmProvider === "gemini" ? "from-blue-600 to-indigo-650 shadow-indigo-600/10" :
                activeLlmProvider === "groq" ? "from-teal-600 to-cyan-650 shadow-teal-600/10" :
                "from-slate-600 to-slate-700"
              } hover:brightness-110 text-white rounded-xl font-black text-xs transition active:scale-98 flex justify-center items-center gap-2 cursor-pointer shadow-lg tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Maximize2 className="w-4 h-4" />
              {!token ? "Sign In Required to Launch Overlay" : "Launch Web Stealth Overlay"}
            </button>
          </div>

          {/* Shield Status */}
          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3 mt-1 select-none">
            <span className="flex items-center gap-1.5 text-emerald-600/90 font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-600" />
              Web Audio Sandbox: EXCLUSIVE
            </span>
            <span className="font-bold tracking-wider text-slate-500">SECURE CLIENT SESSIONS</span>
          </div>
        </div>
      )}

      {/* History Slide Drawer Panel */}
      {showHistoryDrawer && (
        <div className="fixed top-0 right-0 w-[350px] h-full bg-white/98 border-l border-slate-200 shadow-2xl z-[150] p-5 flex flex-col gap-4 animate-slide-in text-slate-800 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-black flex items-center gap-2 text-xs text-(--accent) uppercase tracking-widest">
              <History className="w-4 h-4" />
              Conversation History
            </h3>
            <button
              onClick={() => setShowHistoryDrawer(false)}
              className="text-slate-400 hover:text-slate-800 transition cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 pr-1 scrollbar-thin">
            {history.length === 0 ? (
              <p className="text-slate-400 italic text-xs text-center mt-10">No conversation history yet.</p>
            ) : (
              history.map((turn, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${turn.sender === "interviewer" ? "text-sky-600" :
                        turn.sender === "candidate" ? "text-purple-600" :
                          "text-emerald-600"
                      }`}>
                      {turn.sender === "interviewer" ? "🗣️ Interviewer" :
                        turn.sender === "candidate" ? "🎙️ You" :
                          "🤖 Copilot"}
                    </span>
                    <span className="text-[8px] text-slate-500 font-semibold">
                      {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/50 leading-relaxed font-medium select-text">
                    {turn.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[200] p-6 animate-fade-in">
          <div className="w-[380px] glass-card-light p-8 flex flex-col gap-6 shadow-2xl relative text-slate-850">
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-slate-400 hover:text-slate-800 transition cursor-pointer font-bold absolute top-4 right-4"
            >
              ✕
            </button>

            {/* Header / Tabs */}
            <div className="flex flex-col gap-3.5">
              <div className="text-center select-none">
                <h3 className="text-lg font-black text-slate-850 flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-sky-600" />
                  {authMode === "signup" ? "Create Account" : "Sign In"}
                </h3>
              </div>
              <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-205">
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${authMode === "signin" ? "bg-white border border-slate-250 text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${authMode === "signup" ? "bg-white border border-slate-250 text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {authMode === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-50/60 border border-slate-200/85 px-3.5 py-2.5 pl-10 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-(--accent) focus:ring-4 focus:ring-(--accent)/5 transition-all duration-300 font-semibold"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50/60 border border-slate-200/85 px-3.5 py-2.5 pl-10 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-(--accent) focus:ring-4 focus:ring-(--accent)/5 transition-all duration-300 font-semibold"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50/60 border border-slate-200/85 px-3.5 py-2.5 pl-10 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-(--accent) focus:ring-4 focus:ring-(--accent)/5 transition-all duration-300 font-semibold"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
              <button
                onClick={handlePasswordAuth}
                disabled={loadingLogin || !loginEmail.includes("@") || loginPassword.length < 6 || (authMode === "signup" && !signupName.trim())}
                className="btn-primary-glow w-full !py-3.5 justify-center !rounded-xl font-bold text-xs text-white uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {loadingLogin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : authMode === "signup" ? "Register & Enter" : "Access Copilot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
