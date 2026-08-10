import { PrismaClient } from "./generated/prisma";

// One-time seed script.
// Creates the region rows that workers/pusher need (REGION_ID must
// point to a real row in the "region" table, since website_tick.region_id
// is a required foreign key).
//
// Run once:
//   bun run packages/store/seed.ts
//
// Safe to re-run: it won't create duplicates if regions with the
// same name already exist.

const prisma = new PrismaClient();

const REGIONS = ["India"];

async function main() {
    for (const name of REGIONS) {
        const existing = await prisma.region.findFirst({ where: { name } });

        if (existing) {
            console.log(`Region "${name}" already exists -> id: ${existing.id}`);
            continue;
        }

        const region = await prisma.region.create({ data: { name } });
        console.log(`Created region "${name}" -> id: ${region.id}`);
    }

    console.log("\nCopy one of the ids above into your worker's REGION_ID env var.");
}

main()
    .catch((e) => {
        console.error(e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
