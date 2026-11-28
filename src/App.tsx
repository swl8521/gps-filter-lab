import { useMemo, useState, useRef, useEffect } from "react";
import type { GpsPoint } from "./types/gps";
import { parseGpsCsv } from "./utils/parseGpsCsv";
import { calculateGpsStats } from "./utils/gpsStats";
import { calculateGpsSpeedStats } from "./utils/gpsSpeed";
import { detectSpeedOutliers } from "./utils/gpsOutliers";
import { compareSpeedOutliers } from "./utils/gpsSpeedComparison";
import GpsMap from "./components/GpsMap";
import { createGpsSpeedChartData, createGpsAccuracyChartData } from "./utils/gpsChartData";
import { GpsSpeedChart } from "./components/GpsSpeedChart";
import { GpsAccuracyChart } from "./components/GpsAccuracyChart";
import { GpsOutlierTable } from "./components/GpsOutlierTable";
import { GpsStatsSummary } from "./components/GpsStatsSummary";
import { SpeedThresholdControl } from "./components/SpeedThresholdControl";

function App() {
  // 1. state
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [points, setPoints] = useState<GpsPoint[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [speedThreshold, setSpeedThreshold] = useState(25);
  const [selectedSequence, setSelectedSequence] =
    useState<number | null>(null);

  const [selectionRequestId, setSelectionRequestId] = useState(0);

  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // 2. GPS 통계
  const stats = useMemo(() => {
    return calculateGpsStats(points);
  }, [points]);

  // 3. 속도 통계
  const rawSpeedStats = useMemo(
    () => calculateGpsSpeedStats(points, "raw"),
    [points]
  );
  const filteredSpeedStats = useMemo(
    () => calculateGpsSpeedStats(points, "filtered"),
    [points]
  );

  // 4. 이상 속도 탐지
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

  const resolvedComparisons = speedComparisons.filter(
    (item) => item.status === "resolved"
  );
  const remainingComparisons = speedComparisons.filter(
    (item) => item.status === "remaining"
  );
  const introducedComparisons = speedComparisons.filter(
    (item) => item.status === "introduced"
  );

  const resolvedCount = resolvedComparisons.length;
  const remainingCount = remainingComparisons.length;
  const introducedCount = introducedComparisons.length;

  const validSelectedSequence = useMemo(() => {
    if (selectedSequence === null) return null;

    const isExist = speedComparisons.some(comparison => comparison.sequence === selectedSequence);

    if (isExist)
      return selectedSequence;
    else
      return null;
  }, [selectedSequence, speedComparisons]);

  const speedChartData = useMemo(() => {
    return createGpsSpeedChartData(points);
  }, [points]);

  const accuracyChartData = useMemo(() => {
    return createGpsAccuracyChartData(points);
  }, [points]);

  // 5. Event Handlers
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      const parsedPoints = parseGpsCsv(text);
      // 파싱 성공
      setFile(selectedFile);
      setCsvText(text);
      setPoints(parsedPoints);
      setSelectedSequence(null);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleSequenceSelect = (sequence: number) => {
    setSelectedSequence(sequence);
    setSelectionRequestId(prev => prev + 1);
  };

  useEffect(() => {
    if (validSelectedSequence === null) return;

    const row = rowRefs.current.get(validSelectedSequence);
    const container = tableContainerRef.current;

    if (!row || !container) return;

    const rowRect = row.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const rowTop = rowRect.top - containerRect.top + container.scrollTop;
    const rowCenter = rowTop + rowRect.height / 2;
    const containerCenter = container.clientHeight / 2;
    const targetScrollTop = rowCenter - containerCenter;

    container.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });

  }, [validSelectedSequence, selectionRequestId]);

  // 6 Render
  return (
    <main>
      <h1>GPS Filter Lab</h1>
      <p>GPS 원본 좌표와 필터링 결과를 비교합니다.</p>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />

      {file && (
        <p>선택한 파일: {file.name}</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {csvText && (
        <div>
          <h2>CSV 미리보기</h2>
          <pre>{csvText.slice(0, 500)}</pre>
        </div>
      )}

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
          {
            speedComparisons.length > 0 &&
            <section>
              <h3>GPS 이상 속도 비교</h3>
              <div>
                <div>해결됨 개수 : {resolvedCount}</div>
                <div>여전히 이상 개수 : {remainingCount}</div>
                <div>새로 발생 개수 : {introducedCount}</div>
              </div>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
                ref={tableContainerRef}
              >
                <table>
                  <thead>
                    <tr>
                      <th>Sequence</th>
                      <th>원본 속도 (km/h)</th>
                      <th>필터링 속도 (km/h)</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      speedComparisons.map(comparison => {
                        return (
                          <tr key={comparison.sequence}
                            style={{
                              backgroundColor: comparison.sequence === validSelectedSequence ? "#dbeafe" : "transparent",
                            }}
                            ref={(element) => {
                              if (element) {
                                rowRefs.current.set(comparison.sequence, element);
                              } else {
                                rowRefs.current.delete(comparison.sequence);
                              }
                            }}
                          >
                            <td>
                              <button
                                type="button"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  handleSequenceSelect(comparison.sequence);
                                }}
                              >
                                {comparison.sequence}
                              </button>
                            </td>
                            <td>{comparison.rawSpeed.toFixed(2)}</td>
                            <td>{comparison.filteredSpeed.toFixed(2)}</td>
                            <td>{comparison.status}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }
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