import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { GpsPoint } from "../types/gps";
import type { LatLngTuple } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";

interface GpsMapProps {
  points: GpsPoint[];
}

interface MapBoundsUpdaterProps {
  positions: LatLngTuple[];
}

type ValidRawGpsPoint = GpsPoint & {
  rawLatitude: number;
  rawLongitude: number;
};

export default function GpsMap({ points }: GpsMapProps) {
  function MapBoundsUpdater({ positions }: MapBoundsUpdaterProps) {
    const map = useMap();

    useEffect(() => {
      if (positions.length === 0) return;
      map.fitBounds(positions);
    }, [map, positions]);

    return null;
  }

  const rawPositions = useMemo(() => {
    return points
      .filter(
        (point): point is ValidRawGpsPoint =>
          point.rawLatitude !== null &&
          point.rawLongitude !== null
      )
      .map((point): LatLngTuple => {
        return [point.rawLatitude, point.rawLongitude];
      });
  }, [points]);

  const filteredPositions = useMemo((): LatLngTuple[] => {
    return points
      .map((point): LatLngTuple => {
        return [point.filteredLatitude, point.filteredLongitude];
      });
  }, [points]);

  return (
    <MapContainer
      center={[37.5665, 126.9780]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={rawPositions}
        pathOptions={{
          color: "red",
          weight: 5,
          opacity: 0.7,
        }}
      />
      <Polyline
        positions={filteredPositions}
        pathOptions={{
          color: "blue",
          weight: 3,
          opacity: 0.8,
        }}
      />
      <MapBoundsUpdater positions={rawPositions} />
    </MapContainer>
  );
}