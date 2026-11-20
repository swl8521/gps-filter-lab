import { getCorrectionDistance } from "./haversine";
import type { GpsPoint } from "../types/gps";
import { haversineDistance } from "./haversine";

interface GpsStats {
  totalPoints: number;
  validPoints: number;
  averageCorrectionDistance: number;
  maxCorrectionDistance: number;
  rawTotalDistance: number;
  filteredTotalDistance: number;
  distanceChangePercent: number;
}

type CoordinateType = "raw" | "filtered";

function calculateTotalDistance(
  points: GpsPoint[],
  type: CoordinateType
): number {
  let totalDistance = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const current = points[i];

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

    if (prevLat === null || prevLon === null
      || currentLat === null || currentLon === null
    ) {
      continue;
    }

    totalDistance += haversineDistance(
      prevLat,
      prevLon,
      currentLat,
      currentLon
    );
  }

  return totalDistance;
}

export function calculateGpsStats(points: GpsPoint[]): GpsStats {
  const correctionDistances = points.map((point) => {
    return getCorrectionDistance(point);
  });

  const validDistances = correctionDistances.filter(
    (distance) => distance !== null
  );

  // 평균 보정 거리 계산
  const averageCorrectionDistance =
    validDistances.length > 0
      ? validDistances.reduce((a, b) => a + b, 0) / validDistances.length
      : 0;

  // 최대 보정 거리 계산
  const maxCorrectionDistance = validDistances.reduce(
    (max, distance) => Math.max(max, distance),
    0
  );

  // 원본 경로 총 이동 거리 계산
  const rawTotalDistance = calculateTotalDistance(points, "raw");

  // 필터링 경로 총 이동 거리 계산
  const filteredTotalDistance = calculateTotalDistance(points, "filtered");

  // 거리 변화율 계산
  const distanceChangePercent = rawTotalDistance === 0 ? 0 : ((filteredTotalDistance - rawTotalDistance) / rawTotalDistance) * 100;

  return {
    totalPoints: points.length,
    validPoints: validDistances.length,
    averageCorrectionDistance,
    maxCorrectionDistance,
    rawTotalDistance,
    filteredTotalDistance,
    distanceChangePercent
  };
}