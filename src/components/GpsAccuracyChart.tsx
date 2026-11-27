import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

import type { GpsAccuracyChartPoint } from "../utils/gpsChartData";

interface GpsAccuracyChartProps {
  data: GpsAccuracyChartPoint[],
}

export function GpsAccuracyChart(props: GpsAccuracyChartProps) {
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
        <YAxis unit=" m" />
        <CartesianGrid strokeDasharray={"3 3"} />
        <Tooltip />
        <Legend />
        <Line
          dataKey={"accuracy"}
          stroke="purple"
          dot={false}
          connectNulls={false}
          name="GPS 정확도"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
}