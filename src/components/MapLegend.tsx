interface LegendItem {
  label: string;
  color: string;
  type: "line" | "circle";
}

const legendItems: LegendItem[] = [
  {
    label: "원본 GPS 경로",
    color: "red",
    type: "line"
  },
  {
    label: "필터링 GPS 경로",
    color: "blue",
    type: "line"
  },
  {
    label: "해결된 이상 속도",
    color: "green",
    type: "circle"
  },
  {
    label: "남아 있는 이상 속도",
    color: "red",
    type: "circle"
  },
  {
    label: "새로 발생한 이상 속도",
    color: "orange",
    type: "circle"
  }
];

export default function MapLegend() {
  return (
    <div style={{
      position: "absolute",
      right: "10px",
      bottom: "24px",
      background: "#ffffff",
      padding: "12px",
      borderRadius: "8px",
      zIndex: 1000
    }}>
      <div>지도 범례</div>
      {
        legendItems.map(item => {
          return (
            <div key={item.label}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <div style={{
                width: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <div
                  style={{
                    width: item.type === "line" ? "20px" : "10px",
                    height: item.type === "line" ? "3px" : "10px",
                    borderRadius: item.type === "line" ? 0 : "50%",
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div>{item.label}</div>
            </div>
          )
        })
      }
    </div>
  );
}