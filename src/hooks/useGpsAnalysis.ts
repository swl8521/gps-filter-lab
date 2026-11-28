// src/hooks/useGpsAnalysis.ts

import { useMemo } from "react";
import type { GpsPoint } from "../types/gps";
import { calculateGpsStats } from "../utils/gpsStats";
import { calculateGpsSpeedStats, } from "../utils/gpsSpeed";
import { detectSpeedOutliers } from "../utils/gpsOutliers";
import { compareSpeedOutliers } from "../utils/gpsSpeedComparison";
import { createGpsSpeedChartData, createGpsAccuracyChartData } from "../utils/gpsChartData";

interface UseGpsAnalysisParams {
  points: GpsPoint[];
  speedThreshold: number;
}

interface UseGpsAnalysisData {
  stats: ReturnType<typeof calculateGpsStats>;
  rawSpeedStats: ReturnType<typeof calculateGpsSpeedStats>;
  filteredSpeedStats: ReturnType<typeof calculateGpsSpeedStats>;
  rawOutliers: ReturnType<typeof detectSpeedOutliers>;
  filteredOutliers: ReturnType<typeof detectSpeedOutliers>;
  speedComparisons: ReturnType<typeof compareSpeedOutliers>;
  speedChartData: ReturnType<typeof createGpsSpeedChartData>;
  accuracyChartData: ReturnType<typeof createGpsAccuracyChartData>;
}

export function useGpsAnalysis({
  points,
  speedThreshold,
}: UseGpsAnalysisParams): UseGpsAnalysisData {
  // GPS 통계
  const stats = useMemo(() => {
    return calculateGpsStats(points);
  }, [points]);

  // 속도 통계
  const rawSpeedStats = useMemo(
    () => calculateGpsSpeedStats(points, "raw"),
    [points]
  );

  const filteredSpeedStats = useMemo(
    () => calculateGpsSpeedStats(points, "filtered"),
    [points]
  );

  // 이상 속도 탐지
  const rawOutliers = useMemo(
    () => detectSpeedOutliers(points, "raw", speedThreshold),
    [points, speedThreshold]
  );

  const filteredOutliers = useMemo(
    () => detectSpeedOutliers(points, "filtered", speedThreshold),
    [points, speedThreshold]
  );

  const speedComparisons = useMemo(
    () => compareSpeedOutliers(points, speedThreshold),
    [points, speedThreshold]
  );

  const speedChartData = useMemo(() => {
    return createGpsSpeedChartData(points);
  }, [points]);

  const accuracyChartData = useMemo(() => {
    return createGpsAccuracyChartData(points);
  }, [points]);

  return {
    stats,
    rawSpeedStats,
    filteredSpeedStats,
    rawOutliers,
    filteredOutliers,
    speedComparisons,
    speedChartData,
    accuracyChartData
  };
}