
import { Injectable } from '@angular/core';

export interface Station {
  id: string;
  name: string;
  lines: number[]; // Line IDs this station belongs to
  weight: number; // 1 (Empty) to 10 (Very Crowded)
}

export interface MetroLine {
  id: number;
  name: string;
  colorClass: string;
  textColorClass: string;
}

// Mock Data Structure
const LINES: MetroLine[] = [
  { id: 1, name: "خط ۱ (تجریش - کهریزک)", colorClass: "bg-red-600", textColorClass: "text-red-600" },
  { id: 2, name: "خط ۲ (صادقیه - فرهنگسرا)", colorClass: "bg-blue-700", textColorClass: "text-blue-700" },
  { id: 3, name: "خط ۳ (قائم - آزادگان)", colorClass: "bg-cyan-500", textColorClass: "text-cyan-500" },
  { id: 4, name: "خط ۴ (کلاهدوز - ارم سبز)", colorClass: "bg-yellow-400", textColorClass: "text-yellow-600" }
];

const STATIONS: Station[] = [
  // Line 1 (Red) - North to South
  { id: 'tajrish', name: 'تجریش', lines: [1], weight: 8 },
  { id: 'gheytariyeh', name: 'قیطریه', lines: [1], weight: 6 },
  { id: 'shahid-sadr', name: 'شهید صدر', lines: [1], weight: 4 },
  { id: 'gholhak', name: 'قلهک', lines: [1], weight: 5 },
  { id: 'shariati', name: 'دکتر شریعتی', lines: [1], weight: 6 },
  { id: 'mirdamad', name: 'میرداماد', lines: [1], weight: 7 },
  { id: 'shahid-haqqani', name: 'شهید حقانی', lines: [1], weight: 5 },
  { id: 'shahid-hemmat', name: 'شهید همت', lines: [1], weight: 3 },
  { id: 'mosalla', name: 'مصلی امام خمینی', lines: [1], weight: 4 },
  { id: 'shahid-beheshti', name: 'شهید بهشتی', lines: [1, 3], weight: 9 }, // Junction L1, L3
  { id: 'shahid-mofatteh', name: 'شهید مفتح', lines: [1], weight: 5 },
  { id: 'haft-e-tir', name: 'شهدای هفتم تیر', lines: [1], weight: 8 },
  { id: 'taleghani', name: 'طالقانی', lines: [1], weight: 6 },
  { id: 'darvazeh-dowlat', name: 'دروازه دولت', lines: [1, 4], weight: 10 }, // Junction L1, L4
  { id: 'saadi', name: 'سعدی', lines: [1], weight: 7 },
  { id: 'imam-khomeini', name: 'امام خمینی', lines: [1, 2], weight: 10 }, // Junction L1, L2
  { id: 'panzdah-khordad', name: 'پانزده خرداد', lines: [1], weight: 9 },
  { id: 'kahrizak', name: 'کهریزک', lines: [1], weight: 3 },

  // Line 2 (Blue) - West to East
  { id: 'sadeghieh', name: 'تهران (صادقیه)', lines: [2], weight: 9 },
  { id: 'tarasht', name: 'طرشت', lines: [2], weight: 4 },
  { id: 'sharif', name: 'دانشگاه شریف', lines: [2], weight: 6 },
  { id: 'shademan', name: 'شادمان', lines: [2, 4], weight: 8 }, // Junction L2, L4
  { id: 'navab', name: 'شهید نواب صفوی', lines: [2], weight: 7 }, // Simplified for demo
  { id: 'hasan-abad', name: 'حسن‌آباد', lines: [2], weight: 5 },
  // Imam Khomeini is already defined above
  { id: 'mellat', name: 'ملت', lines: [2], weight: 4 },
  { id: 'baharestan', name: 'بهارستان', lines: [2], weight: 6 },
  { id: 'darvazeh-shemiran', name: 'دروازه شمیران', lines: [2, 4], weight: 8 }, // Junction L2, L4
  { id: 'imam-hossein', name: 'امام حسین', lines: [2], weight: 7 },
  { id: 'farhangsara', name: 'فرهنگسرا', lines: [2], weight: 4 },

  // Line 3 (Cyan) - Partial
  { id: 'ghaem', name: 'قائم', lines: [3], weight: 5 },
  { id: 'nobonyad', name: 'نوبنیاد', lines: [3], weight: 6 },
  // Beheshti defined above
  { id: 'mirza-ye-shirazi', name: 'میرزای شیرازی', lines: [3], weight: 5 },
  { id: 'meydan-e-valiasr', name: 'میدان ولیعصر', lines: [3], weight: 9 },
  { id: 'theater-e-shahr', name: 'تئاتر شهر', lines: [3, 4], weight: 9 }, // Junction L3, L4
  { id: 'azadegan', name: 'آزادگان', lines: [3], weight: 4 },

  // Line 4 (Yellow) - Partial
  { id: 'ekbatan', name: 'شهرک اکباتان', lines: [4], weight: 5 },
  { id: 'bimeh', name: 'بیمه', lines: [4], weight: 4 },
  { id: 'azadi', name: 'میدان آزادی', lines: [4], weight: 8 },
  // Shademan defined above
  // Theater Shahr defined above
  { id: 'ferdowsi', name: 'فردوسی', lines: [4], weight: 7 },
  // Darvazeh Dowlat defined above
  // Darvazeh Shemiran defined above
  { id: 'kolahdooz', name: 'شهید کلاهدوز', lines: [4], weight: 5 },
];

// Simplified Adjacency List (Bi-directional)
// Format: [StationId1, StationId2]
const CONNECTIONS = [
  // Line 1
  ['tajrish', 'gheytariyeh'], ['gheytariyeh', 'shahid-sadr'], ['shahid-sadr', 'gholhak'],
  ['gholhak', 'shariati'], ['shariati', 'mirdamad'], ['mirdamad', 'shahid-haqqani'],
  ['shahid-haqqani', 'shahid-hemmat'], ['shahid-hemmat', 'mosalla'], ['mosalla', 'shahid-beheshti'],
  ['shahid-beheshti', 'shahid-mofatteh'], ['shahid-mofatteh', 'haft-e-tir'], ['haft-e-tir', 'taleghani'],
  ['taleghani', 'darvazeh-dowlat'], ['darvazeh-dowlat', 'saadi'], ['saadi', 'imam-khomeini'],
  ['imam-khomeini', 'panzdah-khordad'], ['panzdah-khordad', 'kahrizak'], // Skipping many for brevity

  // Line 2
  ['sadeghieh', 'tarasht'], ['tarasht', 'sharif'], ['sharif', 'shademan'], ['shademan', 'navab'],
  ['navab', 'hasan-abad'], ['hasan-abad', 'imam-khomeini'], ['imam-khomeini', 'mellat'],
  ['mellat', 'baharestan'], ['baharestan', 'darvazeh-shemiran'], ['darvazeh-shemiran', 'imam-hossein'],
  ['imam-hossein', 'farhangsara'],

  // Line 3
  ['ghaem', 'nobonyad'], ['nobonyad', 'shahid-beheshti'], ['shahid-beheshti', 'mirza-ye-shirazi'],
  ['mirza-ye-shirazi', 'meydan-e-valiasr'], ['meydan-e-valiasr', 'theater-e-shahr'],
  ['theater-e-shahr', 'azadegan'],

  // Line 4
  ['ekbatan', 'bimeh'], ['bimeh', 'azadi'], ['azadi', 'shademan'], ['shademan', 'theater-e-shahr'],
  ['theater-e-shahr', 'ferdowsi'], ['ferdowsi', 'darvazeh-dowlat'], ['darvazeh-dowlat', 'darvazeh-shemiran'],
  ['darvazeh-shemiran', 'kolahdooz']
];

@Injectable({
  providedIn: 'root'
})
export class MetroService {
  
  getStations() {
    return STATIONS.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
  }

  getLines() {
    return LINES;
  }

  // Dijkstra's Algorithm
  findPath(startId: string, endId: string): { path: Station[], totalWeight: number } | null {
    const stations = STATIONS;
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    stations.forEach(s => {
      distances.set(s.id, Infinity);
      previous.set(s.id, null);
      unvisited.add(s.id);
    });

    distances.set(startId, 0);

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let currentId: string | null = null;
      let minDist = Infinity;

      for (const id of unvisited) {
        const dist = distances.get(id)!;
        if (dist < minDist) {
          minDist = dist;
          currentId = id;
        }
      }

      if (currentId === null || currentId === endId) {
        break; 
      }
      
      if (minDist === Infinity) break; // No path

      unvisited.delete(currentId);

      // Get neighbors
      const neighbors = this.getNeighbors(currentId);
      
      for (const neighborId of neighbors) {
        if (!unvisited.has(neighborId)) continue;

        const neighborStation = stations.find(s => s.id === neighborId)!;
        // Cost = 1 (travel time assumption) + Station Weight (Crowd factor)
        // We prioritize less crowded stations, so we add the weight to the cost.
        const cost = 1 + (neighborStation.weight * 0.5); // Weighting factor
        const alt = distances.get(currentId)! + cost;

        if (alt < distances.get(neighborId)!) {
          distances.set(neighborId, alt);
          previous.set(neighborId, currentId);
        }
      }
    }

    if (distances.get(endId) === Infinity) return null;

    // Reconstruct path
    const path: Station[] = [];
    let curr: string | null = endId;
    while (curr !== null) {
      path.unshift(stations.find(s => s.id === curr)!);
      curr = previous.get(curr)!;
    }

    return { path, totalWeight: Math.round(distances.get(endId)!) };
  }

  private getNeighbors(id: string): string[] {
    const neighbors: string[] = [];
    CONNECTIONS.forEach(([a, b]) => {
      if (a === id) neighbors.push(b);
      if (b === id) neighbors.push(a);
    });
    return neighbors;
  }
}
