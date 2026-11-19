import { useState } from "react";
import type { GpsPoint } from "./types/gps";
import { parseGpsCsv } from "./utils/parseGpsCsv";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [points, setPoints] = useState<GpsPoint[]>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const text = await selectedFile.text();

    setCsvText(text);

    const parsedPoints = parseGpsCsv(text);

    setPoints(parsedPoints);

    console.log(parsedPoints);
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

      {csvText && (
        <div>
          <h2>CSV 미리보기</h2>
          <pre>{csvText.slice(0, 500)}</pre>
        </div>
      )}

      <p>GPS 포인트 개수: {points.length}</p>
    </main>
  );
}

export default App;