import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMap,
  Popup,
} from "react-leaflet";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GpsPoint } from "../types/gps";
import type { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import type { GpsSpeedComparison } from "../utils/gpsSpeedComparison";
import type { RefObject } from "react";
import MapLegend from "./MapLegend";

interface GpsMapProps {
  points: GpsPoint[];
  speedComparisons: GpsSpeedComparison[];
  selectedSequence: number | null;
  selectionRequestId: number;
}

interface MapBoundsUpdaterProps {
  positions: LatLngTuple[];
}

interface MapSelectionUpdaterProps {
  selectedSequence: number | null;
  selectionRequestId: number;
  pointMap: Map<number, GpsPoint>;
  markerRefs: RefObject<Map<number, LeafletCircleMarker>>;
}

type ValidRawGpsPoint = GpsPoint & {
  rawLatitude: number;
  rawLongitude: number;
};

function MapBoundsUpdater({ positions }: MapBoundsUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    map.fitBounds(positions);
  }, [map, positions]);

  return null;
}

function MapSelectionUpdater({
  selectedSequence,
  selectionRequestId,
  pointMap,
  markerRefs
}: MapSelectionUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedSequence === null) return;
    const point = pointMap.get(selectedSequence);
    if (!point) return;

    const handleMoveEnd = () => {
      const marker = markerRefs.current.get(selectedSequence);
      if (marker) {
        marker.openPopup();
      }
    };

    map.once("moveend", handleMoveEnd);

    map.flyTo(
      [point.filteredLatitude, point.filteredLongitude],
      17
    );

    return () => {
      map.off("moveend", handleMoveEnd);
    }

  }, [map, selectedSequence, pointMap, markerRefs, selectionRequestId]);

  return null;
}

export default function GpsMap({ points, speedComparisons, selectedSequence, selectionRequestId }: GpsMapProps) {
  const markerRefs = useRef<Map<number, LeafletCircleMarker>>(new Map());
  const pointMap = useMemo(() => {
    const map = new Map<number, GpsPoint>();

    for (const point of points) {
      map.set(point.sequence, point);
    }

    return map;
  }, [points]);

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

  const outlierPositions = useMemo(() => {
    const result = speedComparisons.map((comparison) => {
      const gpsPoint = pointMap.get(comparison.sequence);

      if (!gpsPoint) return null;

      return {
        position: [gpsPoint.filteredLatitude, gpsPoint.filteredLongitude] as LatLngTuple,
        comparison: comparison
      };
    }).filter((comparison) => comparison !== null);

    return result;
  }, [speedComparisons, pointMap]);


  function getOutlierColor(
    status: GpsSpeedComparison["status"]
  ): string {
    switch (status) {
      case "resolved":
        return "green";
      case "remaining":
        return "red";
      case "introduced":
        return "orange";
    }
  }

  return (
    <div
      style={{
        position: "relative"
      }}
    >
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
        {
          outlierPositions.map((item) =>
            <CircleMarker
              key={item.comparison.sequence}
              center={item.position}
              radius={6}
              pathOptions={{ color: getOutlierColor(item.comparison.status) }}
              ref={(marker) => {
                if (marker) {
                  markerRefs.current.set(item.comparison.sequence, marker);
                } else {
                  markerRefs.current.delete(item.comparison.sequence);
                }
              }}
            >
              <Popup>
                <div>GPS 이상 속도 정보</div>
                <div>
                  <div>Sequence: {item.comparison.sequence}</div>
                  <div>원본 속도: {item.comparison.rawSpeed.toFixed(2)} km/h</div>
                  <div>필터링 속도: {item.comparison.filteredSpeed.toFixed(2)} km/h</div>
                  <div>상태: {item.comparison.status}</div>
                </div>
              </Popup>
            </CircleMarker>
          )
        }
        <MapSelectionUpdater
          selectedSequence={selectedSequence}
          selectionRequestId={selectionRequestId}
          pointMap={pointMap}
          markerRefs={markerRefs}
        />
      </MapContainer>
      <MapLegend />
    </div>
  );
}