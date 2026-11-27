import type { GpsSpeedChartPoint } from "../utils/gpsChartData";
import { GpsLineChart } from "./GpsLineChart";

interface GpsSpeedChartProps {
  data: GpsSpeedChartPoint[],
  speedThreshold: number,
}

export function GpsSpeedChart(props: GpsSpeedChartProps) {
  return (
    <GpsLineChart
      data={props.data}
      lines={[
        {
          "dataKey": "rawSpeed",
          "name": "원본 속도",
          "stroke": "red"
        },
        {
          "dataKey": "filteredSpeed",
          "name": "필터링 속도",
          "stroke": "blue"
        }
      ]}
      yAxisUnit=" km/h"
      referenceLine={{
        y: props.speedThreshold,
        stroke: "orange",
        strokeDasharray: "5 5",
        label: "이상 속도 기준선",
      }}
    />
  )
}