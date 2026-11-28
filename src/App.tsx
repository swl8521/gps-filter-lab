import { useState } from "react";
import type { GpsDataset, GpsPoint } from "./types/gps";
import { parseGpsCsv } from "./utils/parseGpsCsv";
import GpsMap from "./components/GpsMap";
import { GpsSpeedChart } from "./components/GpsSpeedChart";
import { GpsAccuracyChart } from "./components/GpsAccuracyChart";
import { GpsOutlierTable } from "./components/GpsOutlierTable";
import { GpsStatsSummary } from "./components/GpsStatsSummary";
import { SpeedThresholdControl } from "./components/SpeedThresholdControl";
import { CsvFileInput } from "./components/CsvFileInput";
import { CsvPreview } from "./components/CsvPreview";
import { GpsSpeedComparisonTable } from "./components/GpsSpeedComparisonTable";
import { useGpsAnalysis } from "./hooks/useGpsAnalysis";
import { useGpsSelection } from "./hooks/useGpsSelection";

const EMPTY_POINTS: GpsPoint[] = [];

function App() {
  // State
  const [dataset, setDataset] = useState<GpsDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speedThreshold, setSpeedThreshold] = useState(25);

  // Derived Data
  const file = dataset?.file ?? null;
  const csvText = dataset?.csvText ?? "";
  const points = dataset?.points ?? EMPTY_POINTS;

  // GPS Analysis
  const {
    stats,
    rawSpeedStats,
    filteredSpeedStats,
    rawOutliers,
    filteredOutliers,
    speedComparisons,
    speedChartData,
    accuracyChartData
  } = useGpsAnalysis({
    points,
    speedThreshold,
  });

  // GPS Selection
  const {
    selectionRequestId,
    validSelectedSequence,
    handleSequenceSelect,
    resetSelection,
  } = useGpsSelection({
    speedComparisons
  });

  // Event Handlers
  const handleFileSelect = async (
    file: File
  ) => {
    try {
      const text = await file.text();
      const parsedPoints = parseGpsCsv(text);
      // 파싱 성공
      setDataset({
        file,
        csvText: text,
        points: parsedPoints,
      });
      resetSelection();
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // Render
  return (
    <main>
      <h1>GPS Filter Lab</h1>
      <p>GPS 원본 좌표와 필터링 결과를 비교합니다.</p>

      <CsvFileInput file={file} error={error} onFileSelect={handleFileSelect} />
      <CsvPreview csvText={csvText} />

      {points.length > 0 && (
        <div>
          <GpsStatsSummary stats={stats} rawSpeedStats={rawSpeedStats} filteredSpeedStats={filteredSpeedStats} />
          <SpeedThresholdControl value={speedThreshold} onChange={setSpeedThreshold} />
          <div>
            원본 GPS 이상 속도 구간 : {rawOutliers.length}개
          </div>
          <div>
            필터링 GPS 이상 속도 구간 : {filteredOutliers.length}개
          </div>
          <GpsOutlierTable title="원본 GPS 이상 속도 구간" outliers={rawOutliers} />
          <GpsOutlierTable title="필터링 GPS 이상 속도 구간" outliers={filteredOutliers} />
          <GpsSpeedComparisonTable speedComparisons={speedComparisons}
            validSelectedSequence={validSelectedSequence}
            selectionRequestId={selectionRequestId}
            onSequenceSelect={handleSequenceSelect}
          />
          <section>
            <h3>GPS 경로 지도</h3>
            <GpsMap
              points={points}
              speedComparisons={speedComparisons}
              selectedSequence={validSelectedSequence}
              selectionRequestId={selectionRequestId}
              onSequenceSelect={handleSequenceSelect} />
          </section>
          <section>
            <h3>차트</h3>
            <GpsSpeedChart data={speedChartData} speedThreshold={speedThreshold} />
            <GpsAccuracyChart data={accuracyChartData} />
          </section>
        </div>
      )}
    </main>
  );
}

export default App;