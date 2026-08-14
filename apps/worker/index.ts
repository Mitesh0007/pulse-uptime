import axios from "axios";
import http from "http";
import { xAckBulk, xReadGroup } from "redisstream/client";
import { prismaClient } from "store/client";

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("worker alive");
}).listen(process.env.PORT || 3002, () => {
    console.log(`Health check server listening on port ${process.env.PORT || 3002}`);
});

const SELF_URL = process.env.RENDER_EXTERNAL_URL;
if (SELF_URL) {
    setInterval(() => {
        fetch(SELF_URL).catch(() => {});
    }, 10 * 60 * 1000);
}

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
    throw new Error("Region not provided");
}

if (!WORKER_ID) {
    throw new Error("Region not provided");
}

async function main() {
    while(1) {
        const response = await xReadGroup(REGION_ID, WORKER_ID);

        if (!response) {
            continue;
        }

        let promises = response.map(({message}) => fetchWebsite(message.url, message.id))
        await Promise.all(promises);
        console.log(promises.length);

        xAckBulk(REGION_ID, response.map(({id}) => id));
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>((resolve, reject) => {
        const startTime = Date.now();

        axios.get(url)
            .then(async () => { 
                const endTime = Date.now();
                await prismaClient.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Up",
                        region_id: REGION_ID,
                        website_id: websiteId
                    }
                })
                resolve()
            })
            .catch(async () => {
                const endTime = Date.now();
                await prismaClient.website_tick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Down",
                        region_id: REGION_ID,
                        website_id: websiteId
                    }
                })
                resolve()
            })
    })
}

main();