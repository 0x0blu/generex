import { debounce } from 'generex/src/transformers/debounce';
import { sample } from 'generex/src/transformers/sample';
import { throttle } from 'generex/src/transformers/throttle';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

export type Module = ReturnType<typeof debounce>;
type ModuleDescriptor = [(number: number) => Module, ['number'], [number]];

const modulesDescriptors = {
  debounce: [debounce, ['number'], [300]],
  sample: [sample, ['number'], [1000]],
  throttle: [throttle, ['number'], [300]],
} satisfies Record<string, ModuleDescriptor>;

type ModuleName = keyof typeof modulesDescriptors;
const modulesNames = Object.keys(modulesDescriptors) as ModuleName[];

interface Props {
  onChangeModules: (modules: Module[]) => void;
}

export function GxInteractiveEditorCodeEditor({ onChangeModules }: Props) {
  const [modulesWithParams, setModulesWithParams] = useState<[name: ModuleName, (...args: any[]) => Module, any[]][]>(
    [],
  );

  const modules = useMemo(
    () => modulesWithParams.map(([, constructor, params]) => constructor(...params)),
    [modulesWithParams],
  );

  useEffect(() => {
    onChangeModules(modules);
  }, [modules, onChangeModules]);

  const moduleToAddOnChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleName = event.target.value as ModuleName | '';
    if (moduleName) {
      const [constructor, , defaults] = modulesDescriptors[moduleName];
      setModulesWithParams((prev) => [...prev, [moduleName, constructor, [...defaults]]]);
    }
  }, []);

  const moduleParamsOnChange = useCallback(
    (moduleIndex: number, paramIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setModulesWithParams((prev) => {
        const next = [...prev];
        next[moduleIndex]![2][paramIndex] = Number(value);
        return next;
      });
    },
    [],
  );

  return (
    <div className="bg-slate-100 flex items-center justify-center">
      <div className="flex flex-col font-mono">
        <div>pipe(</div>
        {modulesWithParams.map(([name], moduleIndex) => {
          const types = modulesDescriptors[name][1];

          return (
            <div key={moduleIndex}>
              &nbsp;&nbsp;{name}(
              {types.map((type, paramIndex) => (
                <Fragment key={paramIndex}>
                  {paramIndex > 0 && ', '}
                  {type == 'number' ? (
                    <input
                      type="number"
                      className="w-20"
                      value={modulesWithParams[moduleIndex]![2][paramIndex]}
                      onChange={(event) => moduleParamsOnChange(moduleIndex, paramIndex, event)}
                    />
                  ) : (
                    'unknown'
                  )}
                </Fragment>
              ))}
              ),&nbsp;
              <button
                onClick={() => {
                  setModulesWithParams((prev) => prev.filter((_, i) => i !== moduleIndex));
                }}
              >
                [x]
              </button>
            </div>
          );
        })}
        <div>
          &nbsp;&nbsp;
          <select value="" onChange={moduleToAddOnChange}>
            <option value="">— Add module —</option>
            {modulesNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>)</div>
      </div>
    </div>
  );
}
