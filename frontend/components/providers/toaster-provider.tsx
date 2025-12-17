"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: { borderRadius: "10px", background: "#111827", color: "#f9fafb" },
        success: { style: { background: "#0f172a" } },
        error: { style: { background: "#7f1d1d" } },
      }}
    />
  );
}
