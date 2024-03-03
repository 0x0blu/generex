import { useEffect, useRef } from 'react';

export class TimelineNode<T> {
  time = Date.now();
  constructor(public value: T, public index: number, public parent?: TimelineNode<unknown>) {}
}

interface Props {
  timelineNodes: TimelineNode<string>[];
  numberOfTimelines: number;
}

export function GxInteractiveEditorTimeline({ timelineNodes, numberOfTimelines }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let canceled = false;

    const container = containerRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function render() {
      if (canceled) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const ratio = window.devicePixelRatio;

      if (canvas.width != width * ratio || canvas.height != height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.scale(ratio, ratio);
      }

      drawTimeline(ctx, timelineNodes, numberOfTimelines, width, height);
      if (!canceled) requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      canceled = true;
    };
  }, [numberOfTimelines, timelineNodes]);

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute top-0 bottom-0 left-0 right-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}

const TIMELINE_HEIGHT = 64;
const TIMELINE_SPEED = 0.1;

function drawTimeline(
  ctx: CanvasRenderingContext2D,
  timelineNodes: TimelineNode<string>[],
  numberOfTimelines: number,
  width: number,
  height: number,
) {
  const now = Date.now();

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw timelines
  const centerY = Math.floor(height / 2);

  const timelinesPositions = new Array(numberOfTimelines).fill(0).map((_, i) => {
    const y = centerY + (i - (numberOfTimelines - 1) / 2) * TIMELINE_HEIGHT;
    return y;
  });

  for (let i = 0; i < numberOfTimelines; i++) {
    const y = timelinesPositions[i]!;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (const node of timelineNodes) {
    const parent = node.parent;
    if (!parent) continue;

    const y1 = timelinesPositions[node.index]!;
    const x1 = width - (now - node.time) * TIMELINE_SPEED;

    const y2 = timelinesPositions[parent.index]!;
    const x2 = width - (now - parent.time) * TIMELINE_SPEED;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  for (const node of timelineNodes) {
    const y = timelinesPositions[node.index]!;
    const x = width - (now - node.time) * TIMELINE_SPEED;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}
