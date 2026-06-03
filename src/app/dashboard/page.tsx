"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/account");
  }, [router]);

  return (
    <div className="flex-1 flex justify-center items-center py-24 bg-[#0B0D19]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest animate-pulse">
          Redirecting to Account...
        </span>
      </div>
    </div>
  );
}
