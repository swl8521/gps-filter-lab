import type { GpsPoint } from "../types/gps";
import { calculateGpsSpeed } from "./gpsSpeed";

export interface GpsSpeedChartPoint {
  sequence: number;
  recordedAt: number;
  rawSpeed: number | null;
  filteredSpeed: number | null;
}

export function createGpsSpeedChartData(
  points: GpsPoint[]
): GpsSpeedChartPoint[] {

  return points.map((point, index) => {
    const rawSpeed = index === 0 ? null : calculateGpsSpeed(points[index - 1], point, "raw");
    const filteredSpeed = index === 0 ? null : calculateGpsSpeed(points[index - 1], point, "filtered");
    return {
      "sequence": point.sequence,
      "recordedAt": point.recordedAt,
      rawSpeed,
      filteredSpeed
    };
  });
}