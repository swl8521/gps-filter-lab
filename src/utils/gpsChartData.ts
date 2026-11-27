import type { GpsPoint } from "../types/gps";
import { calculateGpsSpeed } from "./gpsSpeed";

export interface GpsSpeedChartPoint {
  sequence: number;
  recordedAt: number;
  rawSpeed: number | null;
  filteredSpeed: number | null;
}

export interface GpsAccuracyChartPoint {
  sequence: number;
  recordedAt: number;
  accuracy: number;
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

export function createGpsAccuracyChartData(
  points: GpsPoint[]
): GpsAccuracyChartPoint[] {
  return points.map(point => ({
    "sequence": point.sequence,
    "recordedAt": point.recordedAt,
    "accuracy": point.accuracy,
  }));
}