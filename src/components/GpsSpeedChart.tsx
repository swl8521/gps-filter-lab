import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ReferenceLine
} from "recharts";

import type { GpsSpeedChartPoint } from "../utils/gpsChartData";

interface GpsSpeedChartProps {
  data: GpsSpeedChartPoint[],
  speedThreshold: number,
}

export function GpsSpeedChart(props: GpsSpeedChartProps) {
  return <div
    style={{
      width: "100%",
      height: "300px",
    }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={props.data}
      >
        <XAxis dataKey={"sequence"} />
        <YAxis unit=" km/h" />
        <CartesianGrid strokeDasharray={"3 3"} />
        <Tooltip />
        <Legend />
        <ReferenceLine
          y={props.speedThreshold}
          stroke="orange"
          strokeDasharray="5 5"
        />
        <Line
          dataKey={"rawSpeed"}
          stroke="red"
          dot={false}
          connectNulls={false}
          name="원본 속도"
        />
        <Line
          dataKey={"filteredSpeed"}
          stroke="blue"
          dot={false}
          connectNulls={false}
          name="필터링 속도"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
}