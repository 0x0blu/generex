import { injectable } from 'generex/src/producers/injectable';
import { useCallback, useMemo, useRef, useState } from 'react';
import { GxInteractiveEditorCodeEditor, type Module } from './CodeEditor';
import { GxInteractiveEditorTimeline, TimelineNode } from './Timeline';

export function GxInteractiveEditor() {
  const [modules, setModules] = useState<Module[]>([]);

  const [timelineNodes, setTimelineNodes] = useState<TimelineNode<string>[]>([]);

  const inputRef = useRef(injectable<TimelineNode<string>, undefined>(() => {}));

  const onChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const node = new TimelineNode(event.target.value, 0);
    inputRef.current.inject(node);
    setTimelineNodes((prev) => [...prev, node]);
  }, []);

  useMemo(() => {
    setTimelineNodes([]);

    inputRef.current = injectable<TimelineNode<string>, undefined>(() => {});

    let canceled = false;
    let moduleAccum: AsyncGenerator<TimelineNode<string>, undefined, undefined> = inputRef.current;

    for (let i = 0; i < modules.length; i++) {
      const input = modules[i]!(moduleAccum);

      moduleAccum = (async function* () {
        while (true) {
          const value = await input.next();
          if (value.done) return value.value;

          const node = new TimelineNode(value.value.value, i + 1, value.value);
          setTimelineNodes((prev) => [...prev, node]);
          yield node;
        }
      })();
    }

    (async function () {
      for await (const _ of moduleAccum) {
        if (canceled) return;
      }
    })();

    return () => {
      canceled = true;
    };
  }, [modules]);

  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_1fr_auto] md:grid-cols-2 md:grid-rows-[1fr_auto]">
      <GxInteractiveEditorCodeEditor onChangeModules={setModules} />
      <GxInteractiveEditorTimeline timelineNodes={timelineNodes} numberOfTimelines={1 + modules.length} />
      <input
        type="text"
        placeholder="Type something..."
        className="md:col-span-2 m-2 border p-1 border-slate-300 rounded"
        onChange={onChangeInput}
      />
    </div>
  );
}
