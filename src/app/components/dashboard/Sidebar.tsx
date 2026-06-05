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
  X
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
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-(--border-light) flex-col p-6 relative z-30 justify-between select-none shadow-xs h-full shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition px-2">
            <img src="/logo.svg" className="h-9 w-9 rounded-lg select-none border border-(--border-light)" alt="CrackTheLoop Logo Icon" />
            <span className="font-extrabold tracking-tight text-xl text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
              CrackTheLoop
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-3 mb-2">Portal Pages</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 group border ${
                    isActive 
                      ? "bg-(--accent-soft) text-(--accent) border-(--accent)/15 shadow-xs" 
                      : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 transition ${isActive ? "text-(--accent)" : "text-slate-400 group-hover:text-slate-600"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile details & Logout */}
        <div className="flex flex-col gap-4 border-t border-(--border-light) pt-4">
          <div className="flex flex-col px-3">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Logged In As</span>
            <span className="text-xs font-bold text-slate-600 truncate mt-1">{user?.email}</span>
          </div>

          <div className="flex flex-col gap-2 font-semibold">
            <Link 
              href="/"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[11px] text-slate-500 hover:text-slate-800 transition hover:bg-slate-50"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              Website Home
            </Link>
            <Link 
              href="/copilot"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[11px] text-slate-500 hover:text-slate-800 transition hover:bg-slate-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Open Copilot HUD
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[11px] text-rose-600 hover:bg-rose-50/70 border border-transparent hover:border-rose-100 transition cursor-pointer"
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
          <img src="/logo.svg" className="h-8 w-8 rounded-lg select-none border border-(--border-light)" alt="CrackTheLoop Logo Icon" />
          <span className="font-extrabold tracking-tight text-lg text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            CrackTheLoop
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
        <div className="md:hidden fixed inset-x-0 top-[57px] bottom-0 bg-white/95 backdrop-blur-md z-30 flex flex-col p-6 justify-between select-none animate-fade-in border-b border-(--border-light) shadow-md">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">Navigation</span>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition border ${
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
            <div className="px-2">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Logged In As</span>
              <span className="text-xs font-bold text-slate-600 truncate mt-1 block">{user?.email}</span>
            </div>

            <div className="flex flex-col gap-2 font-semibold">
              <Link 
                href="/"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-slate-500 hover:text-slate-800"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                Website Home
              </Link>
              <Link 
                href="/copilot"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-slate-500 hover:text-slate-800"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Open Copilot HUD
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-rose-600 hover:bg-rose-50/70 cursor-pointer"
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
