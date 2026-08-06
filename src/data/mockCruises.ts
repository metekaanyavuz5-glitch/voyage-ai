import {
  CRUISE_LINES,
  type Coordinates,
  type Cruise,
  type CruiseLine,
  type Destination,
  type ItineraryStop,
} from "@/types/cruise";

/**
 * Mock cruise dataset.
 *
 * This file is the ONLY place that should change when a real cruise API is
 * wired up. `cruiseService.ts` imports `mockCruises` from here — swap this
 * module for a fetch call there and every hook/component above it keeps
 * working unmodified, since they all consume the `Cruise[]` shape from
 * `types/cruise.ts`, not this file directly.
 *
 * All values below are deterministic (seeded), never `Math.random()` or
 * `Date.now()`, so server-rendered and client-rendered output always match.
 */

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helper (mulberry32) — stable across server/client
// ---------------------------------------------------------------------------
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Departure ports (single source of truth for coordinates — reused by
// `mockPorts.ts` so the map and the cruise data never drift apart).
// ---------------------------------------------------------------------------
export const PORT_COORDINATES: Record<string, Coordinates> = {
  Miami: [-80.191, 25.7617],
  Barcelona: [2.1734, 41.3851],
  Southampton: [-1.4044, 50.9097],
  Seattle: [-122.3321, 47.6062],
  Vancouver: [-123.1207, 49.2827],
  Singapore: [103.8198, 1.3521],
};

export const PORT_COUNTRIES: Record<string, string> = {
  Miami: "United States",
  Barcelona: "Spain",
  Southampton: "United Kingdom",
  Seattle: "United States",
  Vancouver: "Canada",
  Singapore: "Singapore",
};

interface PortProfile {
  port: string;
  destination: Destination;
  /** Realistic ports of call reachable from this departure port. */
  callPorts: string[];
  /** Anchor date (ISO) the first generated sailing from this port departs on. */
  anchorDate: string;
}

const PORT_PROFILES: PortProfile[] = [
  {
    port: "Miami",
    destination: "Caribbean",
    callPorts: [
      "Nassau, Bahamas",
      "Cozumel, Mexico",
      "George Town, Cayman Islands",
      "Falmouth, Jamaica",
      "Charlotte Amalie, St. Thomas",
      "Philipsburg, St. Maarten",
    ],
    anchorDate: "2026-09-05",
  },
  {
    port: "Barcelona",
    destination: "Mediterranean",
    callPorts: [
      "Palma de Mallorca, Spain",
      "Rome (Civitavecchia), Italy",
      "Naples, Italy",
      "Marseille, France",
      "Florence (Livorno), Italy",
      "Valletta, Malta",
    ],
    anchorDate: "2026-09-12",
  },
  {
    port: "Southampton",
    destination: "Northern Europe",
    callPorts: [
      "Bergen, Norway",
      "Geiranger, Norway",
      "Stavanger, Norway",
      "Amsterdam, Netherlands",
      "Bruges (Zeebrugge), Belgium",
      "Le Havre (Paris), France",
    ],
    anchorDate: "2026-09-19",
  },
  {
    port: "Seattle",
    destination: "Alaska",
    callPorts: [
      "Juneau, Alaska",
      "Skagway, Alaska",
      "Ketchikan, Alaska",
      "Victoria, British Columbia",
      "Icy Strait Point, Alaska",
      "Sitka, Alaska",
    ],
    anchorDate: "2026-09-26",
  },
  {
    port: "Vancouver",
    destination: "Alaska",
    callPorts: [
      "Juneau, Alaska",
      "Skagway, Alaska",
      "Ketchikan, Alaska",
      "Icy Strait Point, Alaska",
      "Prince Rupert, British Columbia",
      "Sitka, Alaska",
    ],
    anchorDate: "2026-10-03",
  },
  {
    port: "Singapore",
    destination: "Southeast Asia",
    callPorts: [
      "Kuala Lumpur (Port Klang), Malaysia",
      "Penang, Malaysia",
      "Phuket, Thailand",
      "Ho Chi Minh City, Vietnam",
      "Bangkok (Laem Chabang), Thailand",
      "Langkawi, Malaysia",
    ],
    anchorDate: "2026-10-10",
  },
];

const SHIPS: Record<CruiseLine, string[]> = {
  "Royal Caribbean": [
    "Symphony of the Seas",
    "Wonder of the Seas",
    "Icon of the Seas",
    "Oasis of the Seas",
    "Allure of the Seas",
    "Anthem of the Seas",
  ],
  "MSC Cruises": [
    "MSC Seaside",
    "MSC Meraviglia",
    "MSC Grandiosa",
    "MSC Bellissima",
    "MSC World Europa",
    "MSC Virtuosa",
  ],
  Carnival: [
    "Carnival Celebration",
    "Carnival Jubilee",
    "Carnival Venezia",
    "Carnival Panorama",
    "Carnival Horizon",
    "Carnival Mardi Gras",
  ],
  "Norwegian Cruise Line": [
    "Norwegian Prima",
    "Norwegian Viva",
    "Norwegian Encore",
    "Norwegian Joy",
    "Norwegian Bliss",
    "Norwegian Escape",
  ],
  "Princess Cruises": [
    "Sun Princess",
    "Discovery Princess",
    "Enchanted Princess",
    "Sky Princess",
    "Regal Princess",
    "Majestic Princess",
  ],
  "Celebrity Cruises": [
    "Celebrity Ascent",
    "Celebrity Beyond",
    "Celebrity Apex",
    "Celebrity Edge",
    "Celebrity Silhouette",
    "Celebrity Reflection",
  ],
};

/** Baseline nightly rate per line (USD) — premium lines skew higher. */
const BASE_NIGHTLY_RATE: Record<CruiseLine, number> = {
  Carnival: 95,
  "MSC Cruises": 110,
  "Norwegian Cruise Line": 130,
  "Royal Caribbean": 140,
  "Princess Cruises": 150,
  "Celebrity Cruises": 170,
};

/** Baseline rating per line — nudged by seeded jitter per sailing. */
const BASE_RATING: Record<CruiseLine, number> = {
  Carnival: 4.0,
  "MSC Cruises": 4.2,
  "Norwegian Cruise Line": 4.3,
  "Royal Caribbean": 4.5,
  "Princess Cruises": 4.4,
  "Celebrity Cruises": 4.6,
};

const AMENITIES_POOL = [
  "Free WiFi",
  "All-Inclusive Dining",
  "Kids Club",
  "Casino",
  "Spa & Wellness Center",
  "Broadway-Style Shows",
  "Rock Climbing Wall",
  "Waterslides & Aqua Park",
  "Adults-Only Retreat",
  "Specialty Restaurants",
  "24/7 Room Service",
  "Fitness Center",
  "Multiple Pools",
  "Duty-Free Shopping",
] as const;

/** Rotating duration pattern (nights) so sailings feel varied, not uniform. */
const DURATION_PATTERN = [7, 5, 10, 4, 9, 14];

/**
 * Stable placeholder ship photography. Swap for real cruise-line imagery
 * once the API is connected — the `image` field on `Cruise` is a plain URL
 * string either way, so no component changes are required.
 */
const SHIP_IMAGES = [
  "https://picsum.photos/seed/cruise-ship-01/1200/800",
  "https://picsum.photos/seed/cruise-ship-02/1200/800",
  "https://picsum.photos/seed/cruise-ship-03/1200/800",
  "https://picsum.photos/seed/cruise-ship-04/1200/800",
  "https://picsum.photos/seed/cruise-ship-05/1200/800",
  "https://picsum.photos/seed/cruise-ship-06/1200/800",
];

function buildItinerary(
  homePort: string,
  callPorts: string[],
  duration: number,
  seedOffset: number,
): ItineraryStop[] {
  const stops: ItineraryStop[] = [
    { day: 1, port: homePort, arrival: null, departure: "17:00", isSeaDay: false },
  ];

  const totalDays = duration + 1;
  let callCursor = seedOffset % callPorts.length;

  for (let day = 2; day < totalDays; day++) {
    const isSeaDay = day % 3 === 0;
    if (isSeaDay) {
      stops.push({ day, port: "Cruising at Sea", arrival: null, departure: null, isSeaDay: true });
    } else {
      const portName = callPorts[callCursor % callPorts.length];
      callCursor++;
      stops.push({
        day,
        port: portName,
        arrival: "08:00",
        departure: day === totalDays - 1 ? "18:00" : "17:00",
        isSeaDay: false,
      });
    }
  }

  stops.push({ day: totalDays, port: homePort, arrival: "06:00", departure: null, isSeaDay: false });
  return stops;
}

function pickAmenities(seedOffset: number): string[] {
  const count = 5 + (seedOffset % 3); // 5, 6, or 7 amenities
  const start = seedOffset % AMENITIES_POOL.length;
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(AMENITIES_POOL[(start + i * 2) % AMENITIES_POOL.length]);
  }
  return Array.from(new Set(picked));
}

function generateCruises(): Cruise[] {
  const cruises: Cruise[] = [];

  PORT_PROFILES.forEach((profile, portIndex) => {
    (CRUISE_LINES as readonly CruiseLine[]).forEach((cruiseLine, lineIndex) => {
      const rand = seededRandom(portIndex * 100 + lineIndex * 7 + 1);
      const seedOffset = portIndex + lineIndex;

      const duration = DURATION_PATTERN[(portIndex + lineIndex) % DURATION_PATTERN.length];
      const ship = SHIPS[cruiseLine][portIndex];
      const departureDate = addDays(profile.anchorDate, lineIndex * 17 + portIndex * 11);

      const nightlyRate = BASE_NIGHTLY_RATE[cruiseLine];
      const priceJitter = 0.9 + rand() * 0.25; // 0.90 - 1.15
      const price = Math.round((nightlyRate * duration * priceJitter) / 10) * 10 - 1;

      const ratingJitter = (rand() - 0.5) * 0.4; // ±0.2
      const rating = Math.min(5, Math.max(3.5, Math.round((BASE_RATING[cruiseLine] + ratingJitter) * 10) / 10));

      const reviewCount = Math.round(150 + rand() * 3050);

      const id = `${profile.port.toLowerCase()}-${cruiseLine.toLowerCase().replace(/\s+/g, "-")}-${portIndex}${lineIndex}`;

      cruises.push({
        id,
        cruiseName: `${duration}-Night ${profile.destination} from ${profile.port}`,
        cruiseLine,
        shipName: ship,
        departurePort: profile.port,
        departureCoordinates: PORT_COORDINATES[profile.port],
        destination: profile.destination,
        departureDate,
        duration,
        price,
        rating,
        reviewCount,
        image: SHIP_IMAGES[(portIndex + lineIndex) % SHIP_IMAGES.length],
        // TODO: replace with the real deep-link returned by the booking API.
        bookingUrl: "#",
        amenities: pickAmenities(seedOffset + lineIndex * 3),
        itinerary: buildItinerary(profile.port, profile.callPorts, duration, seedOffset),
      });
    });
  });

  return cruises;
}

export const mockCruises: Cruise[] = generateCruises();
