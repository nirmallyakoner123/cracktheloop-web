"use client";

import { useEffect } from "react";

export default function SelectPlanPage() {
  useEffect(() => {
    window.location.replace("/dashboard");
  }, []);

  return null;
}
