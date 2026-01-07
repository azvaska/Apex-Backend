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

const samples = [
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-111111111111",
    timestamp: new Date("2024-12-10T06:00:00.000Z"),
    airTemperatureC: -6.5,
    relativeHumidity: 82,
    windSpeedMs: 7.8,
    windDirectionDeg: 290,
    precipitationMm: 12.0,
    source: "Meteomont",
  },
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-222222222222",
    timestamp: new Date("2024-12-10T06:00:00.000Z"),
    airTemperatureC: -4.2,
    relativeHumidity: 75,
    windSpeedMs: 6.1,
    windDirectionDeg: 310,
    precipitationMm: 8.5,
    source: "Meteomont",
  },
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-333333333333",
    timestamp: new Date("2024-12-10T06:00:00.000Z"),
    airTemperatureC: -3.0,
    relativeHumidity: 69,
    windSpeedMs: 5.4,
    windDirectionDeg: 280,
    precipitationMm: 3.0,
    source: "Meteomont",
  },
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-444444444444",
    timestamp: new Date("2024-12-10T06:00:00.000Z"),
    airTemperatureC: -1.2,
    relativeHumidity: 72,
    windSpeedMs: 4.8,
    windDirectionDeg: 250,
    precipitationMm: 2.0,
    source: "Meteomont",
  },
];

const aggregates = [
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-111111111111",
    validFrom: new Date("2024-12-10T00:00:00.000Z"),
    validTo: new Date("2024-12-11T00:00:00.000Z"),
    avalancheLevel: 4,
    floodLevel: 1,
    stormLevel: 2,
  },
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-222222222222",
    validFrom: new Date("2024-12-10T00:00:00.000Z"),
    validTo: new Date("2024-12-11T00:00:00.000Z"),
    avalancheLevel: 3,
    floodLevel: 1,
    stormLevel: 2,
  },
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-333333333333",
    validFrom: new Date("2024-12-10T00:00:00.000Z"),
    validTo: new Date("2024-12-11T00:00:00.000Z"),
    avalancheLevel: 2,
    floodLevel: 1,
    stormLevel: 1,
  },
  {
    areaId: "5a9f9e8b-1a2b-4c3d-9e0f-444444444444",
    validFrom: new Date("2024-12-10T00:00:00.000Z"),
    validTo: new Date("2024-12-11T00:00:00.000Z"),
    avalancheLevel: 1,
    floodLevel: 1,
    stormLevel: 1,
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

  await prisma.environmentalSample.createMany({
    data: samples,
    skipDuplicates: true,
  });

  await prisma.environmentalAggregate.createMany({
    data: aggregates,
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
