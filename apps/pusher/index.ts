import { prismaClient } from "store/client";
import { xAddBulk } from "redisstream/client";
import http from "http";

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("pusher alive");
}).listen(process.env.PORT || 3003, () => {
    console.log(`Health check server listening on port ${process.env.PORT || 3003}`);
});

const SELF_URL = process.env.RENDER_EXTERNAL_URL;
if (SELF_URL) {
    setInterval(() => {
        fetch(SELF_URL).catch(() => {});
    }, 5 * 60 * 1000);
}

async function main() {
    let websites = await prismaClient.website.findMany({
        select: {
            url: true,
            id: true
        }
    })
  
    await xAddBulk(websites.map(w => ({
        url: w.url,
        id: w.id
    })));
}

setInterval(() => {
    main()
}, 1 * 1000 * 60)

main()