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

function validateRange(
  value: number,
  min: number,
  max: number,
  field: string
): number {
  if (value > max || value < min)
    throw new Error(`${field} 범위(${min} ~ ${max})를 벗어났습니다.`);
  return value;
}

function toRequiredNumber(value: string, field: string): number {
  if (!value?.trim()) {
    throw new Error(`${field}: 값이 없습니다.`);
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${field}: 올바른 숫자가 아닙니다.`);
  }

  return number;
}

function toLatitude(value: string): number {
  const latitude = toRequiredNumber(value, "latitude");

  return validateRange(latitude, -90, 90, "위도");
}

function toNullableLatitude(value: string): number | null {
  const latitude = toNullableNumber(value);

  if (latitude === null) return latitude;

  return validateRange(latitude, -90, 90, "위도");
}

function toLongitude(value: string): number {
  const longitude = toRequiredNumber(value, "longitude");

  return validateRange(longitude, -180, 180, "경도");
}

function toNullableLongitude(value: string): number | null {
  const longitude = toNullableNumber(value);

  if (longitude === null) return longitude;

  return validateRange(longitude, -180, 180, "경도");
}

function toNullableNumber(value: string): number | null {
  if (!value?.trim()) return null;

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${value}: 올바른 숫자가 아닙니다.`);
  }

  return number;
}

function toNonNegativeInteger(
  value: string,
  field: string
): number {
  const number = toRequiredNumber(value, field);

  if (number < 0 || !Number.isSafeInteger(number)) {
    throw new Error(`${field}: 0 이상의 안전한 정수여야 합니다.`);
  }

  return number;
}
const number = 9007199254740992;

console.log(Number.isInteger(number));
console.log(Number.isSafeInteger(number));

export function parseGpsCsv(csvText: string): GpsPoint[] {
  const result = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    throw new Error("CSV 파싱 중 오류가 발생했습니다.");
  }

  return result.data.map((row, index) => {
    try {
      return {
        runId: row.run_id,
        sequence: toNonNegativeInteger(row.sequence, "sequence"),
        recordedAt: toNonNegativeInteger(row.recorded_at, "recorded_at"),
        rawLatitude: toNullableLatitude(row.raw_latitude),
        rawLongitude: toNullableLongitude(row.raw_longitude),
        filteredLatitude: toLatitude(row.filtered_latitude),
        filteredLongitude: toLongitude(row.filtered_longitude),
        accuracy: validateRange(
          toRequiredNumber(row.accuracy, "accuracy"),
          0,
          Infinity,
          "accuracy"
        ),
        altitude: toNullableNumber(row.altitude),
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류";

      throw new Error(`CSV ${index + 2}행: ${message}`);
    }
  });
}