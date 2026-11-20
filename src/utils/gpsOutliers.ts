import type { GpsPoint } from "../types/gps";
import { calculateGpsSpeed } from "./gpsSpeed";

export interface GpsSpeedOutlier {
  sequence: number;
  recordedAt: number;
  speed: number;
  type: "raw" | "filtered";
}

export function detectSpeedOutliers(
  points: GpsPoint[],
  type: "raw" | "filtered",
  threshold: number
): GpsSpeedOutlier[] {
  const outliterResult: GpsSpeedOutlier[] = [];

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currPoint = points[i];
    const gpsSpeed = calculateGpsSpeed(prevPoint, currPoint, type);

    if (gpsSpeed === null) continue;

    if (gpsSpeed > threshold) {
      outliterResult.push({
        sequence: currPoint.sequence,
        recordedAt: currPoint.recordedAt,
        speed: gpsSpeed,
        type: type,
      });
    }
  }

  return outliterResult;
}