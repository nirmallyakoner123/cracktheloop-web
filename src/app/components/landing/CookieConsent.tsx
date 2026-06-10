"use client";
 
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Lock, Check, X } from "lucide-react";
 
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Consent categories
  const [consents, setConsents] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });
 
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }
 
  function setCookie(name: string, value: string, days = 365) {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }
 
  useEffect(() => {
    // Check if user already set consent
    const consentSet = getCookie("ctl_cookie_consent");
    if (!consentSet) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2500); // Wait 2.5s before showing
      return () => clearTimeout(timer);
    } else {
      try {
        const saved = JSON.parse(consentSet);
        setConsents({
          essential: true,
          analytics: !!saved.analytics,
          marketing: !!saved.marketing,
        });
        if (saved.analytics) {
          loadAnalyticsScripts();
        }
      } catch (e) {
        if (consentSet === "accepted") {
          setConsents({ essential: true, analytics: true, marketing: true });
          loadAnalyticsScripts();
        }
      }
    }
  }, []);
 
  const handleAcceptAll = () => {
    const allConsents = { essential: true, analytics: true, marketing: true };
    setConsents(allConsents);
    setCookie("ctl_cookie_consent", JSON.stringify(allConsents));
    loadAnalyticsScripts();
    setVisible(false);
  };
 
  const handleDeclineOptional = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    setConsents(essentialOnly);
    setCookie("ctl_cookie_consent", JSON.stringify(essentialOnly));
    setVisible(false);
  };
 
  const handleSavePreferences = () => {
    setCookie("ctl_cookie_consent", JSON.stringify(consents));
    if (consents.analytics) {
      loadAnalyticsScripts();
    }
    setVisible(false);
  };
 
  const loadAnalyticsScripts = () => {
    if (typeof window === "undefined" || (window as any)._ctl_analytics_loaded) return;
    (window as any)._ctl_analytics_loaded = true;
    console.log("[TRACKING] Initializing Google Analytics and optional telemetry scripts...");
  };
 
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-55 w-auto md:w-[350px] bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 select-none"
        >
          {/* Close button on card */}
          <button
            onClick={handleDeclineOptional}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-650 p-1 rounded-full hover:bg-slate-50 transition cursor-pointer"
            aria-label="Decline cookies"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-start gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-(--accent-soft) flex items-center justify-center border border-(--accent)/15 shrink-0 shadow-xs">
              <Cookie className="w-4.5 h-4.5 text-(--accent) animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                Cookie Preferences
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                We use cookies to personalize content, measure performance, and support our referral system.
              </p>
            </div>
          </div>
 
          {/* Settings Section */}
          {showSettings ? (
            <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5 opacity-70">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Essential
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Always Active</span>
              </div>

              <div className="border-t border-slate-200/60" />

              <label className="flex items-center justify-between text-[11px] font-bold text-slate-750 cursor-pointer">
                <span>Analytics Cookies</span>
                <input
                  type="checkbox"
                  checked={consents.analytics}
                  onChange={() => setConsents(c => ({ ...c, analytics: !c.analytics }))}
                  className="accent-(--accent) cursor-pointer w-4 h-4"
                />
              </label>

              <div className="border-t border-slate-200/60" />

              <label className="flex items-center justify-between text-[11px] font-bold text-slate-750 cursor-pointer">
                <span>Marketing Cookies</span>
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={() => setConsents(c => ({ ...c, marketing: !c.marketing }))}
                  className="accent-(--accent) cursor-pointer w-4 h-4"
                />
              </label>
            </div>
          ) : (
            <div className="text-left">
              <button
                onClick={() => setShowSettings(true)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-(--accent) transition cursor-pointer underline underline-offset-2"
              >
                Manage Preferences
              </button>
            </div>
          )}
 
          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-1 select-none">
            {showSettings ? (
              <>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 cursor-pointer transition py-2 flex-1 text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="btn-primary !py-2.5 !px-4 !text-[10px] !font-bold uppercase tracking-wider cursor-pointer shadow-xs flex-1 justify-center"
                >
                  Save Choices
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDeclineOptional}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 cursor-pointer transition py-2 flex-1 text-center font-bold"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary !py-2.5 !px-4 !text-[10px] !font-bold uppercase tracking-wider cursor-pointer shadow-xs flex-1 justify-center"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
