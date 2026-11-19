import type { GpsPoint } from "../types/gps";

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // 지구 평균 반지름 (m)

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const deltaLat = toRadians(lat1 - lat2);
  const deltaLon = toRadians(lon1 - lon2);

  const a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.pow(Math.sin(deltaLon / 2), 2);

  const safeA = Math.min(1, Math.max(0, a));

  const c = 2 * Math.atan2(
    Math.sqrt(safeA),
    Math.sqrt(1 - safeA)
  );
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

export function getCorrectionDistance(point: GpsPoint): number | null {
  if (point.rawLatitude === null || point.rawLongitude === null) {
    return null;
  }

  const distance = haversineDistance(
    point.rawLatitude,
    point.rawLongitude,
    point.filteredLatitude,
    point.filteredLongitude
  );

  return distance;
}