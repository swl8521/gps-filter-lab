import Papa from "papaparse";
import type { GpsPoint } from "../types/gps";

interface CsvRow {
  run_id: string;
  sequence: string;
  recorded_at: string;
  raw_latitude: string;
  raw_longitude: string;
  filtered_latitude: string;
  filtered_longitude: string;
  accuracy: string;
  altitude: string;
}

function toNullableNumber(value: string): number | null {
  if (!value?.trim()) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseGpsCsv(csvText: string): GpsPoint[] {
  const result = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error("CSV 파싱 중 오류가 발생했습니다.");
  }

  return result.data.map((row) => ({
    runId: row.run_id,
    sequence: Number(row.sequence),
    recordedAt: Number(row.recorded_at),
    rawLatitude: toNullableNumber(row.raw_latitude),
    rawLongitude: toNullableNumber(row.raw_longitude),
    filteredLatitude: Number(row.filtered_latitude),
    filteredLongitude: Number(row.filtered_longitude),
    accuracy: Number(row.accuracy),
    altitude: toNullableNumber(row.altitude),
  }));
}