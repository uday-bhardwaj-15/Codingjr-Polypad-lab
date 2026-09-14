"use client";
import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";

export interface EditModalProps {
  title: string;
  hint?: string;
  value: string;
  type: "number" | "text";
  accentColor: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
}
export function EditModal({
  title,
  hint,
  value,
  type,
  accentColor,
  onConfirm,
  onCancel,
}: EditModalProps) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);
  const confirm = () => onConfirm(draft);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#1E1B4B",
          border: `2px solid ${accentColor}`,
          borderRadius: 16,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          minWidth: 320,
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            color: "#E2E8F0",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "Inter, system-ui",
          }}
        >
          {title}
        </div>
        {hint && (
          <div
            style={{
              color: "#64748B",
              fontSize: 11,
              fontFamily: "Inter, system-ui",
              lineHeight: 1.5,
            }}
          >
            {hint}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirm();
            if (e.key === "Escape") onCancel();
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: `2px solid ${accentColor}`,
            fontSize: 18,
            fontWeight: 700,
            color: "#1E1B4B",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "Inter, monospace",
          }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={confirm}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              background: accentColor,
              color: "#fff",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Inter, system-ui",
            }}
          >
            ✓ Confirm
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              background: "#334155",
              color: "#cbd5e1",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Inter, system-ui",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
