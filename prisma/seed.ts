import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "generated/prisma/client";

import dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({adapter});

const areas = [
  {
    id: "5a9f9e8b-1a2b-4c3d-9e0f-111111111111",
    name: "Val Zoldana",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [12.1, 46.4],
          [12.3, 46.4],
          [12.3, 46.6],
          [12.1, 46.6],
          [12.1, 46.4],
        ],
      ],
    },
  },
  {
    id: "5a9f9e8b-1a2b-4c3d-9e0f-222222222222",
    name: "Passo Giau",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [12.0, 46.45],
          [12.2, 46.45],
          [12.2, 46.55],
          [12.0, 46.55],
          [12.0, 46.45],
        ],
      ],
    },
  },
  {
    id: "5a9f9e8b-1a2b-4c3d-9e0f-333333333333",
    name: "Cortina",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [12.1, 46.5],
          [12.3, 46.5],
          [12.3, 46.7],
          [12.1, 46.7],
          [12.1, 46.5],
        ],
      ],
    },
  },
  {
    id: "5a9f9e8b-1a2b-4c3d-9e0f-444444444444",
    name: "Val di Fassa",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [11.6, 46.4],
          [11.8, 46.4],
          [11.8, 46.6],
          [11.6, 46.6],
          [11.6, 46.4],
        ],
      ],
    },
  },
];

async function main() {
  for (const area of areas) {
    await prisma.areaOfInterest.upsert({
      where: {id: area.id},
      update: {
        name: area.name,
        geometry: area.geometry,
      },
      create: area,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
