import { getCorrectionDistance } from "./haversine";
import type { GpsPoint } from "../types/gps";

interface GpsStats {
  totalPoints: number;
  validPoints: number;
  averageCorrectionDistance: number;
  maxCorrectionDistance: number;
}

export function calculateGpsStats(points: GpsPoint[]): GpsStats {
  const correctionDistances = points.map((point) => {
    return getCorrectionDistance(point);
  });

  const validDistances = correctionDistances.filter(
    (distance) => distance !== null
  );

  // 평균 보정 거리 계산
  const averageDistance =
    validDistances.length > 0
      ? validDistances.reduce((a, b) => a + b, 0) / validDistances.length
      : 0;

  // 최대 보정 거리 계산
  const maxDistance = validDistances.reduce(
    (max, distance) => Math.max(max, distance),
    0
  );

  return {
    totalPoints: points.length,
    validPoints: validDistances.length,
    averageCorrectionDistance: averageDistance,
    maxCorrectionDistance: maxDistance
  };
}