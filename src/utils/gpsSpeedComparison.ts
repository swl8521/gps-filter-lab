import type { GpsPoint } from "../types/gps";
import type { GpsSpeedOutlier } from "./gpsOutliers";
import { detectSpeedOutliers } from "./gpsOutliers";
import { calculateGpsSpeed } from "./gpsSpeed";

export type SpeedComparisonStatus =
  | "resolved"
  | "remaining"
  | "introduced";

export interface GpsSpeedComparison {
  sequence: number;
  recordedAt: number;
  rawSpeed: number;
  filteredSpeed: number;
  status: SpeedComparisonStatus;
}

export function compareSpeedOutliers(
  points: GpsPoint[],
  threshold: number
): GpsSpeedComparison[] {
  const rawOutliers = detectSpeedOutliers(points, "raw", threshold);
  const filteredOutliers = detectSpeedOutliers(points, "filtered", threshold);

  const rawMap = new Map<number, GpsSpeedOutlier>(
    rawOutliers.map((outlier) => [outlier.sequence, outlier])
  );

  const filteredMap = new Map<number, GpsSpeedOutlier>(
    filteredOutliers.map((outlier) => [outlier.sequence, outlier])
  );

  const sequences = new Set<number>([
    ...rawMap.keys(),
    ...filteredMap.keys()
  ]);

  const results: GpsSpeedComparison[] = [];
  for (const sequence of sequences) {
    const rawOutlier = rawMap.get(sequence);
    const filteredOutlier = filteredMap.get(sequence);

    let status: SpeedComparisonStatus;
    if (rawOutlier && !filteredOutlier) {
      status = "resolved";
    } else if (rawOutlier && filteredOutlier) {
      status = "remaining";
    } else {
      status = "introduced";
    }

    const index = points.findIndex(
      (point) => point.sequence === sequence
    );

    if (index < 1) continue;

    const prevPoint = points[index - 1];
    const currPoint = points[index];
    const rawSpeed = calculateGpsSpeed(prevPoint, currPoint, "raw");
    const filteredSpeed = calculateGpsSpeed(prevPoint, currPoint, "filtered");

    if (rawSpeed === null || filteredSpeed === null) continue;

    results.push(
      {
        sequence,
        recordedAt: currPoint.recordedAt,
        rawSpeed,
        filteredSpeed,
        status
      }
    );
  }

  return results.sort((a, b) => a.sequence - b.sequence);
}