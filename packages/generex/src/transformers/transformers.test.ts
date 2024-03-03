import { readdir } from 'fs/promises';
import { describe, expect, test } from 'vitest';
import { debounce } from './debounce.js';
import { deduplicate } from './deduplicate.js';
import { deduplicateSync } from './deduplicateSync.js';
import { enumerate } from './enumerate.js';
import { enumerateSync } from './enumerateSync.js';
import { filter } from './filter.js';
import { filterSync } from './filterSync.js';
import { flatMap } from './flatMap.js';
import { flatMapSync } from './flatMapSync.js';
import { map } from './map.js';
import { mapSync } from './mapSync.js';
import { preload } from './preload.js';
import { sample } from './sample.js';
import { throttle } from './throttle.js';
import { zip } from './zip.js';
import { zipSync } from './zipSync.js';

const transformers = (await readdir(__dirname).then((files) =>
  files.filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts')).map((file) => file.slice(0, -3)),
)) as (keyof typeof defaultTransforms)[];

const defaultTransforms = {
  debounce: debounce(5),
  deduplicate: deduplicate(),
  deduplicateSync: deduplicateSync(),
  enumerate: enumerate(),
  enumerateSync: enumerateSync(),
  filter: filter(() => true),
  filterSync: filterSync(() => true),
  flatMap: flatMap((value) => [value]),
  flatMapSync: flatMapSync((value) => [value]),
  map: map((value) => value),
  mapSync: mapSync((value) => value),
  preload: preload(1),
  sample: sample(5),
  throttle: throttle(10),
  zip: zip(),
  zipSync: zipSync(),
};

describe('All transformers call return on input when they return', () => {
  test.each(transformers)('transformer/%s', async (name) => {
    let returned = false;

    let input: any = {
      next: () => ({ done: false, value: 1 }),
      return: () => ((returned = true), { done: true, value: undefined }),
    };

    if (!name.endsWith('Sync')) input = throttle(10)(input);

    if (name.startsWith('zip')) input = [input, input];

    const transform: any = defaultTransforms[name];

    const output = transform(input);

    await output.next();
    await output.return(undefined);

    expect(returned).toBe(true);
  });
});
