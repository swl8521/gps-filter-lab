import { useRef, useEffect } from "react"
import type { GpsSpeedComparison } from "../utils/gpsSpeedComparison";

interface GpsSpeedComparisonTableProps {
  speedComparisons: GpsSpeedComparison[];
  validSelectedSequence: number | null;
  selectionRequestId: number;
  onSequenceSelect: (sequence: number) => void;
}

export function GpsSpeedComparisonTable({
  speedComparisons,
  validSelectedSequence,
  selectionRequestId,
  onSequenceSelect,
}: GpsSpeedComparisonTableProps) {


  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

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

  if (speedComparisons.length === 0) return null;

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

  return (
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
                          onSequenceSelect(comparison.sequence);
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
  )
}