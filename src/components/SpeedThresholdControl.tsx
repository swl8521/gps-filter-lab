interface SpeedThresholdControlProps {
  value: number,
  onChange: (value: number) => void,
}

export function SpeedThresholdControl({
  value,
  onChange,
}: SpeedThresholdControlProps) {
  return (
    <div>
      <label htmlFor="speed-threshold">
        이상 속도 기준: {value} km/h
      </label>
      <input
        id="speed-threshold"
        type="range"
        min={5}
        max={40}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
