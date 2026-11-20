import type { GpsPoint } from "../types/gps";
import { haversineDistance } from "./haversine";

export interface GpsSpeedStats {
  averageSpeed: number;
  maxSpeed: number;
  validSegments: number;
}

export function calculateTimeDifference(
  prev: GpsPoint,
  current: GpsPoint
): number | null {
  const time = (current.recordedAt - prev.recordedAt) / 1000;
  if (time <= 0) return null;
  return time;
}

export function calculateGpsSpeed(
  prev: GpsPoint,
  current: GpsPoint,
  type: "raw" | "filtered"
): number | null {
  const timeDifference = calculateTimeDifference(prev, current);

  if (timeDifference === null) return null;

  const prevLat = type === "raw"
    ? prev.rawLatitude
    : prev.filteredLatitude;

  const prevLon = type === "raw"
    ? prev.rawLongitude
    : prev.filteredLongitude;

  const currentLat = type === "raw"
    ? current.rawLatitude
    : current.filteredLatitude;

  const currentLon = type === "raw"
    ? current.rawLongitude
    : current.filteredLongitude;

  if (
    prevLat === null ||
    prevLon === null ||
    currentLat === null ||
    currentLon === null
  ) {
    return null;
  }

  const distance = haversineDistance(prevLat, prevLon, currentLat, currentLon);

  return distance / timeDifference * 3.6;
}

export function calculateGpsSpeedStats(
  points: GpsPoint[],
  type: "raw" | "filtered"
): GpsSpeedStats {
  const speeds: number[] = [];
  let maxSpeed = 0;

  for (let i = 1; i < points.length; i++) {
    const gpsSpeed = calculateGpsSpeed(
      points[i - 1],
      points[i],
      type
    );

    if (gpsSpeed === null) continue;

    speeds.push(gpsSpeed);
    maxSpeed = Math.max(maxSpeed, gpsSpeed);
  }

  const validSegments = speeds.length;
  const averageSpeed = validSegments > 0
    ? speeds.reduce((a, b) => a + b, 0) / validSegments
    : 0;

  return {
    averageSpeed,
    maxSpeed,
    validSegments
  }
}
