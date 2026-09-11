import React from 'react';
import { PolyLabCanvas } from '@/components/labs/polylab/canvas/PolyLabCanvas';

interface PageProps {
  params: Promise<{ canvasId: string }>;
}

export default async function CanvasPage({ params }: PageProps) {
  const { canvasId } = await params;

  return (
    <div className="w-screen h-screen overflow-hidden">
      <PolyLabCanvas canvasId={canvasId} />
    </div>
  );
}
