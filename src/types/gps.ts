export interface GpsPoint {
  runId: string;
  sequence: number;
  recordedAt: number;
  rawLatitude: number | null;
  rawLongitude: number | null;
  filteredLatitude: number;
  filteredLongitude: number;
  accuracy: number;
  altitude: number | null;
}