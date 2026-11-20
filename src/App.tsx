import { useMemo, useState } from "react";
import type { GpsPoint } from "./types/gps";
import { parseGpsCsv } from "./utils/parseGpsCsv";
import { calculateGpsStats } from "./utils/gpsStats";
import { calculateGpsSpeedStats } from "./utils/gpsSpeed";
import { detectSpeedOutliers } from "./utils/gpsOutliers";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const stats = useMemo(() => {
    return calculateGpsStats(points);
  }, [points]);
  const [error, setError] = useState<string | null>(null);
  const [speedThreshold, setSpeedThreshold] = useState(25);

  const rawSpeedStats = useMemo(
    () => calculateGpsSpeedStats(points, "raw"),
    [points]
  );
  const filteredSpeedStats = useMemo(
    () => calculateGpsSpeedStats(points, "filtered"),
    [points]
  );

  const rawOutliers = useMemo(
    () => detectSpeedOutliers(points, "raw", speedThreshold),
    [points, speedThreshold]
  );

  const filteredOutliers = useMemo(
    () => detectSpeedOutliers(points, "filtered", speedThreshold),
    [points, speedThreshold]
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPoints([]);
    setError(null);
    setCsvText("");

    try {
      const text = await selectedFile.text();
      setCsvText(text);
      const parsedPoints = parseGpsCsv(text);
      setPoints(parsedPoints);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

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

      {!error && points.length > 0 && (
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
          <div>
            <label htmlFor="speed-threshold">
              이상 속도 기준: {speedThreshold} km/h
            </label>
            <input
              id="speed-threshold"
              type="range"
              min={5}
              max={40}
              step={1}
              value={speedThreshold}
              onChange={(e) => setSpeedThreshold(Number(e.target.value))}
            />
          </div>
          <div>
            원본 GPS 이상 속도 구간 : {rawOutliers.length}개
          </div>
          <div>
            필터링 GPS 이상 속도 구간 : {filteredOutliers.length}개
          </div>
          <h3>원본 GPS 이상 속도 구간</h3>
          {rawOutliers.length === 0 ? (
            <p>이상 속도 구간이 없습니다.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sequence</th>
                  <th>기록 시간</th>
                  <th>속도 (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {rawOutliers.map((outlier) => (
                  <tr key={outlier.sequence}>
                    <td>{outlier.sequence}</td>
                    <td>{new Date(outlier.recordedAt).toLocaleString("ko-KR")}</td>
                    <td>{outlier.speed.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h3>필터링 GPS 이상 속도 구간</h3>
          {filteredOutliers.length === 0 ? (
            <p>이상 속도 구간이 없습니다.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sequence</th>
                  <th>기록 시간</th>
                  <th>속도 (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutliers.map((outlier) => (
                  <tr key={outlier.sequence}>
                    <td>{outlier.sequence}</td>
                    <td>{new Date(outlier.recordedAt).toLocaleString("ko-KR")}</td>
                    <td>{outlier.speed.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}

export default App;