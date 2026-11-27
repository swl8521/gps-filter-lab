import type { GpsAccuracyChartPoint } from "../utils/gpsChartData";
import { GpsLineChart } from "./GpsLineChart";

interface GpsAccuracyChartProps {
  data: GpsAccuracyChartPoint[],
}

export function GpsAccuracyChart(props: GpsAccuracyChartProps) {
  return (
    <GpsLineChart
      data={props.data}
      lines={
        [
          {
            "dataKey": "accuracy",
            "name": "GPS 정확도",
            "stroke": "purple"
          }
        ]
      }
      yAxisUnit=" m"
    />
  )
}