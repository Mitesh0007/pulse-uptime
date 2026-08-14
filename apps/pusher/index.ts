import { prismaClient } from "store/client";
import { xAddBulk } from "redisstream/client";
import http from "http";

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("pusher alive");
}).listen(process.env.PORT || 3003, () => {
    console.log(`Health check server listening on port ${process.env.PORT || 3003}`);
});

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
}, 3 * 1000 * 60)

main()