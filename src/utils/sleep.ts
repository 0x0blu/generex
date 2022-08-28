export default async function sleep(ms: number): Promise<void> {
	await new Promise(fulfill => setTimeout(fulfill, ms).unref());
}
