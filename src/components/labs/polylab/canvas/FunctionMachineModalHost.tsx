"use client";
import { useCallback } from "react";
import { EditModal } from "../tiles/shared/EditModal";
import { useCanvasStore } from "./useCanvasStore";

export function FunctionMachineModalHost() {
  const activeModal = useCanvasStore((s) => s.activeFunctionModal);
  const closeFunctionModal = useCanvasStore((s) => s.closeFunctionModal);
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);
  const tile = useCanvasStore((s) =>
    activeModal ? s.tiles[activeModal.tileId] : undefined,
  );

  const commit = useCallback(
    (val: string) => {
      if (activeModal) {
        if (activeModal.kind === "input") {
          const parsed = Number(val.trim());
          if (!isNaN(parsed))
            updateTileProps(activeModal.tileId, { inputVal: parsed });
        } else if (val.trim()) {
          updateTileProps(activeModal.tileId, { rule: val.trim() });
        }
      }
      closeFunctionModal();
    },
    [activeModal, updateTileProps, closeFunctionModal],
  );

  if (!activeModal || !tile) return null;
  return activeModal.kind === "input" ? (
    <EditModal
      title="Set Input Value (x)"
      type="number"
      value={String(tile.props?.inputVal ?? 4)}
      accentColor="#10B981"
      onConfirm={commit}
      onCancel={closeFunctionModal}
    />
  ) : (
    <EditModal
      title="Edit Function Formula"
      hint={
        "Examples:  × 3    +7    2x+1    x^2-1    ÷4\nUse x as the variable."
      }
      type="text"
      value={tile.props?.rule ?? "× 3"}
      accentColor="#818CF8"
      onConfirm={commit}
      onCancel={closeFunctionModal}
    />
  );
}
