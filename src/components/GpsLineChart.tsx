import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip, XAxis, YAxis,
  ReferenceLine
} from "recharts";

interface ChartLineConfig<T> {
  dataKey: Extract<keyof T, string>;
  name: string;
  stroke: string;
}

interface GpsLineChartProps<T> {
  data: T[];
  lines: ChartLineConfig<T>[],
  yAxisUnit: string,
  height?: number,
  referenceLine?: ChartReferenceLineConfig
}

interface ChartReferenceLineConfig {
  y: number;
  stroke: string;
  strokeDasharray?: string;
  label?: string;
}

export function GpsLineChart<T extends { sequence: number }>({
  data,
  lines,
  yAxisUnit,
  height = 300,
  referenceLine,
}: GpsLineChartProps<T>) {

  return (
    <div style={{
      width: "100%",
      height: height,
    }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <XAxis dataKey={"sequence"} />
          <YAxis unit={yAxisUnit} />
          <CartesianGrid strokeDasharray={"3 3"} />
          <Tooltip />
          <Legend />
          {
            referenceLine &&
            <ReferenceLine
              y={referenceLine.y}
              stroke={referenceLine.stroke}
              strokeDasharray={referenceLine.strokeDasharray}
              label={referenceLine.label}
              ifOverflow="extendDomain"
            />
          }
          {
            lines.map((line) => {
              return (
                <Line
                  key={line.dataKey}
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.stroke}
                  dot={false}
                  connectNulls={false}
                />
              )
            })
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}