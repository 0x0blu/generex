import { readdir } from 'fs/promises';
import { resolve } from 'path';
import { describe, expect, test } from 'vitest';

const directories = ['producers', 'transformers', 'collectors'];

const modules = (
  await Promise.all(
    directories.map(async (directory) => {
      const path = resolve(__dirname, directory);
      const files = await readdir(path);

      return files
        .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
        .map((file) => [directory, file.slice(0, -3)] as const);
    }),
  )
).flatMap((modules) => modules);

describe('All modules have a function with the same name.', () => {
  test.each(modules)('%s/%s.', async (directory, module) => {
    const moduleContents = await import(`./${directory}/${module}`);

    expect(moduleContents).toHaveProperty(module);
    expect(moduleContents[module]).toBeInstanceOf(Function);
  });
});
