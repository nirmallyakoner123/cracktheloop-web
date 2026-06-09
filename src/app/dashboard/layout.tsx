"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  useEffect(() => {
    const savedToken = getCookie("ctl_token");
    const savedUser = getCookie("ctl_user");
    
    if (!savedToken) {
      router.push("/login");
      return;
    }
    
    try {
      setUser(JSON.parse(savedUser || "{}"));
    } catch (e) {
      console.error("Failed to parse user storage", e);
    }
    setLoading(false);
  }, [router]);

  function handleLogout() {
    document.cookie = "ctl_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie = "ctl_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-frost) flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest animate-pulse">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-(--bg-mist) text-(--text-primary) flex flex-col md:flex-row relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--accent)/3 blur-[120px] pointer-events-none select-none z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/3 blur-[120px] pointer-events-none select-none z-10"></div>

      {/* Standalone Sidebar Component */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Dashboard Content Area - scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-20">
        {children}
      </div>
    </div>
  );
}
