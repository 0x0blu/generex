import { readdirSync } from "fs";
import { resolve } from "path";
import gx from ".";

const exported = new Set(Object.values(gx));

const modules = readdirSync(resolve(__dirname, "modules"))
	.filter(file => file.endsWith(".ts") && !file.endsWith(".test.ts"))
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	.map(file => require(`./modules/${file}`).default);

const utils = readdirSync(resolve(__dirname, "utils"))
	.filter(file => file.endsWith(".ts") && !file.endsWith(".test.ts"))
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	.map(file => require(`./utils/${file}`).default);

describe("index", () => {
	test.each(modules)("exports all modules", async module => {
		expect(exported).toContainEqual(module);
	});

	test.each(utils)("exports all utils", async util => {
		expect(exported).toContainEqual(util);
	});
});
