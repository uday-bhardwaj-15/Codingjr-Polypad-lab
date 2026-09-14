"use client";

import React, { memo, useCallback, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Group, Rect, Text, Line, Circle } from "react-konva";
import type Konva from "konva";
import { TileShell } from "../shared/TileShell";
import { useCanvasStore } from "../../canvas/useCanvasStore";
import { EditModal } from "../shared/EditModal";

export interface FunctionMachineProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  inputVal?: number;
  rule?: string;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// Evaluate custom function safely
function computeOutput(inp: number, r: string): number {
  try {
    let expr = (r || "").trim();
    if (!expr) return inp;
    if (/^[+\-*/×÷^]/.test(expr)) expr = "x " + expr;
    expr = expr.replace(/x²/g, "x**2");
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/(\d+)\s*x/gi, "$1 * x");
    expr = expr.replace(/\bx\b/gi, `(${inp})`);
    const sanitized = expr.replace(/\s/g, "");
    if (!/^[0-9+\-*/().\s%*]+$/.test(sanitized)) return inp;
    const result = new Function(`return (${expr});`)();
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return Math.round(result * 100) / 100;
    }
    return inp;
  } catch {
    return inp;
  }
}

// ─── Modal rendered via portal outside Konva tree ────────────────────────────
interface EditModalProps {
  title: string;
  hint?: string;
  value: string;
  type: "number" | "text";
  accentColor: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
}

// ─── Main FunctionMachine Component ─────────────────────────────────────────
export const FunctionMachine = memo(function FunctionMachine({
  id,
  x,
  y,
  rotation = 0,
  inputVal = 4,
  rule = "× 3",
  width = 240,
  height = 160,
  isLocked = false,
  isSelected = false,
}: FunctionMachineProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const [editingInput, setEditingInput] = useState(false);
  const [editingRule, setEditingRule] = useState(false);

  const outputVal = computeOutput(inputVal, rule);

  const openModal = useCanvasStore((s) => s.openFunctionModal); // new store action

  const handleEditInput = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      openModal(id, "input");
    },
    [id, openModal],
  );

  const handleEditRule = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      openModal(id, "rule");
    },
    [id, openModal],
  );

  const commitInput = useCallback(
    (val: string) => {
      const parsed = Number(val.trim());
      if (!isNaN(parsed)) updateTileProps(id, { inputVal: parsed });
      setEditingInput(false);
    },
    [id, updateTileProps],
  );

  const commitRule = useCallback(
    (val: string) => {
      if (val.trim()) updateTileProps(id, { rule: val.trim() });
      setEditingRule(false);
    },
    [id, updateTileProps],
  );

  // Machine geometry — scales with width/height
  const W = width;
  const H = height;
  const bodyX = Math.round(W * 0.17);
  const bodyY = Math.round(H * 0.13);
  const bodyW = Math.round(W * 0.66);
  const bodyH = Math.round(H * 0.72);
  const pipeMidY1 = Math.round(H * 0.29);
  const pipeMidY2 = Math.round(H * 0.45);

  const pipeLeft = [
    Math.round(W * 0.06),
    pipeMidY1,
    bodyX,
    pipeMidY1,
    bodyX,
    pipeMidY2,
    Math.round(W * 0.06),
    pipeMidY2,
  ];
  const pipeRight = [
    bodyX + bodyW,
    pipeMidY1,
    Math.round(W * 0.94),
    pipeMidY1,
    Math.round(W * 0.94),
    pipeMidY2,
    bodyX + bodyW,
    pipeMidY2,
  ];

  const inCx = Math.round(W * 0.06);
  const inCy = Math.round(H * 0.375);
  const outCx = Math.round(W * 0.94);
  const outCy = Math.round(H * 0.375);
  const badgeR = Math.round(Math.min(W, H) * 0.11);

  return (
    <>
      <TileShell
        id={id}
        x={x}
        y={y}
        rotation={rotation}
        width={W}
        height={H}
        isLocked={isLocked}
        isSelected={isSelected}
      >
        <Group>
          {/* Machine body */}
          <Rect
            x={bodyX}
            y={bodyY}
            width={bodyW}
            height={bodyH}
            fill="#4F46E5"
            stroke="#1E1E28"
            strokeWidth={3}
            cornerRadius={12}
            shadowColor="rgba(0,0,0,0.25)"
            shadowBlur={12}
          />

          {/* Pipes */}
          <Line
            points={pipeLeft}
            closed
            fill="#3730A3"
            stroke="#1E1E28"
            strokeWidth={2}
          />
          <Line
            points={pipeRight}
            closed
            fill="#3730A3"
            stroke="#1E1E28"
            strokeWidth={2}
          />

          {/* Input badge */}
          <Group
            x={inCx - badgeR}
            y={inCy - badgeR}
            onClick={handleEditInput}
            onTap={handleEditInput}
            onMouseEnter={(e) => {
              const c = e.target.getStage()?.container();
              if (c) c.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const c = e.target.getStage()?.container();
              if (c) c.style.cursor = "default";
            }}
          >
            <Circle
              x={badgeR}
              y={badgeR}
              radius={badgeR}
              fill="#10B981"
              stroke="#1E1E28"
              strokeWidth={2}
            />
            <Text
              x={0}
              y={badgeR - Math.round(badgeR * 0.55)}
              width={badgeR * 2}
              text={String(inputVal)}
              align="center"
              fontSize={
                String(inputVal).length > 3
                  ? Math.round(badgeR * 0.6)
                  : Math.round(badgeR * 0.8)
              }
              fontStyle="bold"
              fill="#FFFFFF"
              listening={false}
            />
          </Group>

          {/* Screen */}
          <Rect
            x={bodyX + 6}
            y={bodyY + 8}
            width={bodyW - 12}
            height={bodyH - 16}
            fill="#1E1B4B"
            stroke="#818CF8"
            strokeWidth={2}
            cornerRadius={6}
          />
          <Text
            x={bodyX + 6}
            y={bodyY + 12}
            width={bodyW - 12}
            text="FUNCTION  f(x)"
            align="center"
            fontSize={Math.max(7, Math.round(bodyW * 0.08))}
            fontStyle="bold"
            fill="#A5B4FC"
          />

          {/* Clickable rule text */}
          <Group
            onClick={handleEditRule}
            onTap={handleEditRule}
            onMouseEnter={(e) => {
              const c = e.target.getStage()?.container();
              if (c) c.style.cursor = "text";
            }}
            onMouseLeave={(e) => {
              const c = e.target.getStage()?.container();
              if (c) c.style.cursor = "default";
            }}
          >
            <Text
              x={bodyX + 6}
              y={bodyY + Math.round(bodyH * 0.32)}
              width={bodyW - 12}
              text={rule.length > 12 ? rule.substring(0, 12) + "…" : rule}
              align="center"
              fontSize={
                rule.length > 8
                  ? Math.max(10, Math.round(bodyW * 0.1))
                  : Math.max(12, Math.round(bodyW * 0.13))
              }
              fontStyle="bold"
              fill="#FDE047"
            />
            <Text
              x={bodyX + 6}
              y={bodyY + Math.round(bodyH * 0.68)}
              width={bodyW - 12}
              text="✎ tap to edit"
              align="center"
              fontSize={Math.max(6, Math.round(bodyW * 0.065))}
              fill="#818CF8"
              opacity={0.85}
            />
          </Group>

          {/* Decorative dots */}
          <Circle
            x={bodyX + 12}
            y={bodyY + bodyH - 10}
            radius={4}
            fill="#F43F5E"
          />
          <Circle
            x={bodyX + 24}
            y={bodyY + bodyH - 10}
            radius={4}
            fill="#38BDF8"
          />
          <Circle
            x={bodyX + 36}
            y={bodyY + bodyH - 10}
            radius={4}
            fill="#4ADE80"
          />

          {/* Output badge */}
          <Group x={outCx - badgeR} y={outCy - badgeR}>
            <Circle
              x={badgeR}
              y={badgeR}
              radius={badgeR}
              fill="#F59E0B"
              stroke="#1E1E28"
              strokeWidth={2}
            />
            <Text
              x={0}
              y={badgeR - Math.round(badgeR * 0.55)}
              width={badgeR * 2}
              text={String(outputVal)}
              align="center"
              fontSize={
                String(outputVal).length > 3
                  ? Math.round(badgeR * 0.6)
                  : Math.round(badgeR * 0.8)
              }
              fontStyle="bold"
              fill="#FFFFFF"
            />
          </Group>

          {/* Labels */}
          <Text
            x={inCx - badgeR}
            y={inCy + badgeR + 3}
            width={badgeR * 2}
            text="INPUT"
            align="center"
            fontSize={Math.max(5, Math.round(badgeR * 0.4))}
            fontStyle="bold"
            fill="#6EE7B7"
          />
          <Text
            x={outCx - badgeR}
            y={outCy + badgeR + 3}
            width={badgeR * 2}
            text="OUTPUT"
            align="center"
            fontSize={Math.max(5, Math.round(badgeR * 0.4))}
            fontStyle="bold"
            fill="#FCD34D"
          />
        </Group>
      </TileShell>

      {/* ── Modals via portal — rendered in document.body, outside Konva ── */}
      {editingInput && (
        <EditModal
          title="Set Input Value (x)"
          type="number"
          value={String(inputVal)}
          accentColor="#10B981"
          onConfirm={commitInput}
          onCancel={() => setEditingInput(false)}
        />
      )}
      {editingRule && (
        <EditModal
          title="Edit Function Formula"
          hint={
            "Examples:  × 3    +7    2x+1    x^2-1    ÷4\nUse x as the variable."
          }
          type="text"
          value={rule}
          accentColor="#818CF8"
          onConfirm={commitRule}
          onCancel={() => setEditingRule(false)}
        />
      )}
    </>
  );
});
