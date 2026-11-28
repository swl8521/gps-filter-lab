import type { GpsSpeedOutlier } from "../utils/gpsOutliers";

interface GpsOutlierTableProps {
  title: string,
  outliers: GpsSpeedOutlier[]
}

export function GpsOutlierTable({
  title,
  outliers,
}: GpsOutlierTableProps) {
  // JSX 구현
  return (
    <div>
      <h3>{title}</h3>
      {
        outliers.length === 0 ? (
          <p>이상 속도 구간이 없습니다.</p>
        ) : (
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Sequence</th>
                  <th>기록 시간</th>
                  <th>속도 (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {
                  outliers.map((outlier) => (
                    <tr key={outlier.sequence}>
                      <td>{outlier.sequence}</td>
                      <td>{new Date(outlier.recordedAt).toLocaleString("ko-KR")}</td>
                      <td>{outlier.speed.toFixed(2)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
