"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Shield, 
  Home, 
  History, 
  LogOut, 
  Sparkles,
  User,
  Menu,
  X,
  Gift,
  FileText,
  PhoneCall
} from "lucide-react";

interface SidebarProps {
  user: any;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Call Sessions",
      href: "/dashboard/call-sessions",
      icon: PhoneCall,
    },
    {
      name: "CVs / Resumes",
      href: "/dashboard/resumes",
      icon: FileText,
    },
    {
      name: "Saved Interviews",
      href: "/dashboard/interviews",
      icon: History,
    },
    {
      name: "Referral Program",
      href: "/dashboard/referrals",
      icon: Gift,
    },
    {
      name: "Account Overview",
      href: "/dashboard/account",
      icon: User,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-(--border-light) flex-col p-6 relative z-30 justify-between select-none shadow-xs h-full shrink-0 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition px-2">
            <img src="/logo.png" className="h-10 w-auto select-none object-contain" alt="CrackTheLoop Logo Icon" />
            <span className="font-bold tracking-tight text-xl text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
              Crack<span className="text-gradient-coral font-black">TheLoop</span>
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider px-3 mb-2">Portal Pages</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition duration-200 group border ${
                    isActive 
                      ? "bg-(--accent-soft) text-(--accent) border-(--accent)/15 shadow-xs" 
                      : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition ${isActive ? "text-(--accent)" : "text-slate-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile details & Logout */}
        <div className="flex flex-col gap-3 border-t border-(--border-light) pt-3">
          {/* Buy Credits Sidebar Banner */}
          <div className="mx-1 bg-gradient-to-br from-indigo-50 to-red-50/50 border border-indigo-100/50 p-3.5 rounded-xl flex flex-col gap-2.5 relative overflow-hidden group shadow-xs select-none">
            {/* Soft decorative glow background */}
            <div className="absolute top-[-40%] right-[-40%] w-24 h-24 rounded-full bg-(--accent)/10 blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-(--accent-soft) text-(--accent)">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-[11px] text-indigo-700 font-semibold uppercase tracking-wider">Out of Fuel?</span>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-slate-800 leading-tight">Need More AI Replies?</h4>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Refill fuel credits to keep your live interview copilot running.
              </p>
            </div>

            <Link
              href="/pricing"
              className="w-full py-2 bg-[#E8503A] hover:bg-[#F06B57] hover:brightness-110 text-white rounded-lg text-center font-semibold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm shadow-[#E8503A]/10 hover:shadow-[#E8503A]/20"
            >
              Get Credits
            </Link>
          </div>

          <div className="flex flex-col px-3">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
            <span className="text-xs font-medium text-slate-600 truncate mt-1">{user?.email}</span>
          </div>

          <div className="flex flex-col gap-2 font-medium">
            <Link 
              href="/"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 transition hover:bg-slate-50"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              Website Home
            </Link>

            <button
              onClick={onLogout}
              className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50/70 border border-transparent hover:border-rose-100 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden w-full bg-white border-b border-(--border-light) px-6 py-4 flex justify-between items-center relative z-40 select-none shadow-xs shrink-0">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
          <img src="/logo.png" className="h-9 w-auto select-none object-contain" alt="CrackTheLoop Logo Icon" />
          <span className="font-bold tracking-tight text-lg text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            Crack<span className="text-gradient-coral font-black">TheLoop</span>
          </span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-white/95 backdrop-blur-md z-30 flex flex-col p-6 justify-between select-none animate-fade-in border-b border-(--border-light) shadow-md overflow-y-auto">
          <div className="flex flex-col gap-6">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider px-2">Navigation</span>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/dashboard" 
                  ? pathname === "/dashboard" 
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-xs font-semibold transition border ${
                      isActive 
                        ? "bg-(--accent-soft) text-(--accent) border-(--accent)/15 shadow-xs" 
                        : "text-slate-500 border-transparent hover:text-slate-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-(--accent)" : "text-slate-400"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 border-t border-(--border-light) pt-4">
            {/* Mobile Buy Credits Banner */}
            <div className="mx-2 bg-gradient-to-br from-indigo-50 to-red-50/50 border border-indigo-100/50 p-3 rounded-lg flex items-center justify-between gap-3 shadow-xs select-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-indigo-700 font-semibold uppercase tracking-wider">Out of Fuel?</span>
                <h4 className="text-xs font-semibold text-slate-800">Need More AI Replies?</h4>
              </div>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 bg-[#E8503A] hover:bg-[#F06B57] hover:brightness-110 text-white rounded-lg font-semibold text-xs uppercase tracking-wider shrink-0 transition"
              >
                Get Credits
              </Link>
            </div>

            <div className="px-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Logged In As</span>
              <span className="text-xs font-medium text-slate-600 truncate mt-1 block">{user?.email}</span>
            </div>

            <div className="flex flex-col gap-2 font-medium">
              <Link 
                href="/"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                Website Home
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50/70 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
