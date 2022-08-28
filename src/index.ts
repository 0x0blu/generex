import concatenate from "./modules/concatenate";
import concatenateAsync from "./modules/concatenate-async";
import debounceAsync from "./modules/debounce-async";
import distinct from "./modules/distinct";
import distinctAsync from "./modules/distinct-async";
import enumerate from "./modules/enumerate";
import enumerateAsync from "./modules/enumerate-async";
import filter from "./modules/filter";
import filterAsync from "./modules/filter-async";
import fromIterable from "./modules/from-iterable";
import fromIterableWithReturnValue from "./modules/from-iterable-with-return-value";
import fromListener from "./modules/from-listener";
import map from "./modules/map";
import mapAsync from "./modules/map-async";
import mergeAsync from "./modules/merge-async";
import preloadAsync from "./modules/preload-async";
import reduce from "./modules/reduce";
import reduceAsync from "./modules/reduce-async";
import returnValue from "./modules/return-value";
import returnValueAsync from "./modules/return-value-async";
import throttleAsync from "./modules/throttle-async";
import toArray from "./modules/to-array";
import toArrayAsync from "./modules/to-array-async";
import toArrayWithReturnValue from "./modules/to-array-with-return-value";
import toArrayWithReturnValueAsync from "./modules/to-array-with-return-value-async";
import zip from "./modules/zip";
import zipAsync from "./modules/zip-async";
import Queue from "./utils/queue";
import sleep from "./utils/sleep";

const gx = {
	concatenate,
	concatenateAsync,
	debounceAsync,
	distinct,
	distinctAsync,
	enumerate,
	enumerateAsync,
	filter,
	filterAsync,
	fromIterable,
	fromIterableWithReturnValue,
	fromListener,
	map,
	mapAsync,
	mergeAsync,
	preloadAsync,
	Queue,
	reduce,
	reduceAsync,
	returnValue,
	returnValueAsync,
	sleep,
	throttleAsync,
	toArray,
	toArrayAsync,
	toArrayWithReturnValue,
	toArrayWithReturnValueAsync,
	zip,
	zipAsync,
};

export default gx;
