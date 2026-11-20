import { useMemo, useState } from "react";
import type { GpsPoint } from "./types/gps";
import { parseGpsCsv } from "./utils/parseGpsCsv";
import { calculateGpsStats } from "./utils/gpsStats";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const stats = useMemo(() => {
    return calculateGpsStats(points);
  }, [points]);
  const [error, setError] = useState<string | null>(null);

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
        </div>
      )}
    </main>
  );
}

export default App;