"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Shield, 
  Home, 
  CreditCard, 
  History, 
  LogOut, 
  Loader2,
  Sparkles,
  User,
  Menu,
  X
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("ctl_token");
    const savedUser = localStorage.getItem("ctl_user");
    
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
    localStorage.removeItem("ctl_token");
    localStorage.removeItem("ctl_user");
    document.cookie = "ctl_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "ctl_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D19] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest animate-pulse">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Account Overview",
      href: "/dashboard/account",
      icon: User,
    },
    {
      name: "Saved Interviews",
      href: "/dashboard/interviews",
      icon: History,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/5 bg-blur-glow pointer-events-none select-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/5 bg-blur-glow pointer-events-none select-none"></div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex md:w-64 bg-[#0c1125]/85 border-r border-white/5 flex-col p-6 relative z-30 justify-between select-none">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 hover:opacity-90 transition px-2">
            <img src="/logo-horizontal-dark.svg" className="h-14 w-auto select-none" alt="Logo" />
          </a>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-3 mb-2">Portal Pages</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 group border ${
                    isActive 
                      ? "bg-sky-500/10 text-white border-sky-550/20" 
                      : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition ${isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>

        {/* User profile details & Logout */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
          <div className="flex flex-col px-3">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Logged In As</span>
            <span className="text-xs font-bold text-slate-300 truncate mt-1">{user?.email}</span>
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <a 
              href="/"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[11px] text-slate-400 hover:text-white transition hover:bg-white/5"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              Website Home
            </a>
            <a 
              href="/copilot"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[11px] text-slate-400 hover:text-white transition hover:bg-white/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Open Copilot HUD
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[11px] text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden w-full bg-[#0c1125]/85 border-b border-white/5 px-6 py-4 flex justify-between items-center relative z-40 select-none">
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <img src="/logo-horizontal-dark.svg" className="h-10 w-auto select-none" alt="Logo" />
        </a>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-[#0B0D19]/95 backdrop-blur-md z-30 flex flex-col p-6 justify-between select-none animate-fade-in border-b border-white/5">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-2">Navigation</span>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition border ${
                      isActive 
                        ? "bg-sky-500/10 text-white border-sky-550/20" 
                        : "text-slate-400 border-transparent hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
            <div className="px-2">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block">Logged In As</span>
              <span className="text-xs font-bold text-slate-350 truncate mt-1 block">{user?.email}</span>
            </div>

            <div className="flex flex-col gap-2 font-semibold">
              <a 
                href="/"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-slate-400 hover:text-white"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                Website Home
              </a>
              <a 
                href="/copilot"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-slate-400 hover:text-white"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Open Copilot HUD
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Portal Container */}
      <div className="flex-1 flex flex-col min-w-0 relative z-20">
        {children}
      </div>
    </div>
  );
}
