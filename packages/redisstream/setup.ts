import { createClient } from "redis";

const STREAM_NAME = "betteruptime:website";

async function main() {
    const REGION_ID = process.env.REGION_ID;

    if (!REGION_ID) {
        throw new Error("REGION_ID env var is required, e.g. REGION_ID=<id> bun run setup.ts");
    }

const client = await createClient({
    url: process.env.REDIS_URL
})
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

    try {
        await client.xGroupCreate(STREAM_NAME, REGION_ID, "$", {
            MKSTREAM: true
        });
        console.log(`Created consumer group "${REGION_ID}" on stream "${STREAM_NAME}"`);
    } catch (e: any) {
        if (e?.message?.includes("BUSYGROUP")) {
            console.log(`Consumer group "${REGION_ID}" already exists on stream "${STREAM_NAME}" — nothing to do.`);
        } else {
            throw e;
        }
    }

    await client.quit();
}

main();
