import type { calculateGpsSpeedStats } from "../utils/gpsSpeed"
import type { calculateGpsStats } from "../utils/gpsStats";

interface GpsStatsSummaryProps {
  stats: ReturnType<typeof calculateGpsStats>,
  rawSpeedStats: ReturnType<typeof calculateGpsSpeedStats>,
  filteredSpeedStats: ReturnType<typeof calculateGpsSpeedStats>,
}

export function GpsStatsSummary({
  stats,
  rawSpeedStats,
  filteredSpeedStats
}: GpsStatsSummaryProps) {
  return (
    <div>
      <div>전체 GPS 포인트 : {stats.totalPoints}</div>
      <div>유효 GPS 포인트 : {stats.validPoints}</div>
      <div>
        평균 보정 거리 : {stats.averageCorrectionDistance.toFixed(2)}m
      </div>
      <div>
        최대 보정 거리 : {stats.maxCorrectionDistance.toFixed(2)}m
      </div>
      <div>
        원본 GPS 총 이동 거리 : {stats.rawTotalDistance.toFixed(2)}m
      </div>
      <div>
        필터링 GPS 총 이동 거리 : {stats.filteredTotalDistance.toFixed(2)}m
      </div>
      <div>
        GPS 이동 거리 변화율 : {stats.distanceChangePercent > 0 ? "+" : ""}{stats.distanceChangePercent.toFixed(2)}%
      </div>
      <div>
        원본 GPS 평균 속도 : {rawSpeedStats.averageSpeed.toFixed(2)} km/h
      </div>
      <div>
        원본 GPS 최대 속도 : {rawSpeedStats.maxSpeed.toFixed(2)} km/h
      </div>
      <div>
        필터링 GPS 평균 속도 : {filteredSpeedStats.averageSpeed.toFixed(2)} km/h
      </div>
      <div>
        필터링 GPS 최대 속도 : {filteredSpeedStats.maxSpeed.toFixed(2)} km/h
      </div>
      <div>
        원본 GPS 유효 속도 구간 : {rawSpeedStats.validSegments}개
      </div>
      <div>
        필터링 GPS 유효 속도 구간 : {filteredSpeedStats.validSegments}개
      </div>
    </div>
  )
}