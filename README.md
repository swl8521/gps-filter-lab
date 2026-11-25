# GPS Filter Lab

**English** | [한국어](./README.ko.md)

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)

GPS Filter Lab is a browser-based GPS data analysis tool designed to compare raw and filtered GPS coordinates, detect speed anomalies, and evaluate GPS filtering results.

The project originated from practical GPS tracking challenges encountered while developing [PaceLeague](https://paceleague.co.kr), a location-based running application.

## Background

GPS tracking data can be affected by positioning errors,
signal interference, noisy measurements, and inconsistent
location updates.

Visually comparing GPS trajectories alone is not sufficient
to determine whether filtering improves data quality.

GPS Filter Lab was developed to provide a quantitative
approach to analyzing GPS data and identifying potential
side effects introduced by filtering.

## Project Status

🚧 Active Development

Core GPS data analysis and map visualization features
have been implemented. Automated testing, filtering
algorithm experiments, and public deployment are planned.

## Key Features

### 1. CSV Import and Validation

- Import GPS tracking data from CSV files
- Parse CSV records using Papa Parse
- Validate required fields and coordinate ranges
- Validate numeric values, sequences, and timestamps
- Display row-specific validation errors
- Preserve previously loaded data when an import fails

### 2. GPS Distance Analysis

- Calculate distances using the Haversine formula
- Compare total raw and filtered travel distances
- Calculate distance change percentages
- Calculate average and maximum GPS correction distances

### 3. GPS Speed Analysis

- Calculate segment speeds using coordinates and timestamps
- Calculate average and maximum speeds
- Compare raw and filtered speed statistics
- Detect potential speed anomalies using an adjustable threshold

### 4. Speed Outlier Comparison

Speed anomalies are classified into three categories:

| Status | Description |
| --- | --- |
| Resolved | Detected in raw data but not in filtered data |
| Remaining | Detected in both raw and filtered data |
| Introduced | Detected only in filtered data |

This classification helps identify potential side effects
that may not be visible through aggregate statistics alone.

### 5. Interactive Map Visualization

- Display raw and filtered GPS trajectories
- Automatically fit the map to the recorded raw trajectory
- Visualize speed anomalies using color-coded markers
- Display detailed speed information in marker popups
- Navigate to a GPS point by selecting a table row
- Support repeated selection of the same point
- Display a map legend

## Analysis Example

The following example was obtained by analyzing
670 recorded GPS points from a running session.

### Distance Comparison

| Metric | Result |
| --- | ---: |
| Total GPS points | 670 |
| Raw distance | 8,381.55 m |
| Filtered distance | 8,406.45 m |
| Distance change | +0.30% |

### Speed Outlier Comparison

Speed threshold: 15 km/h

| Metric | Count |
| --- | ---: |
| Raw speed outliers | 5 |
| Filtered speed outliers | 4 |
| Resolved | 3 |
| Remaining | 2 |
| Introduced | 2 |

Although the total number of detected speed outliers
decreased from five to four, two new anomalies appeared
after filtering.

This demonstrates why analyzing individual GPS segments
is important when evaluating filtering results.

A speed threshold violation does not necessarily indicate
a GPS measurement error. It identifies a segment that
requires further investigation.

## Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| CSV Parsing | Papa Parse |
| Map Library | Leaflet, React Leaflet |
| Map Tiles | OpenStreetMap |
| Styling | CSS |
| Linting | ESLint |
| Version Control | Git, GitHub |

## Technical Highlights

### Comparable Distance Calculation

Raw and filtered travel distances are calculated using
matching segments with valid raw coordinates to reduce
comparison bias caused by missing raw GPS values.

### Efficient GPS Point Lookup

GPS points are indexed using a Map keyed by sequence
numbers to avoid repeated linear searches during
map marker lookup.

React's useMemo is used to avoid unnecessary
recalculations when the underlying data has not changed.

### State Consistency

- File-related state is updated only after successful parsing
- Selected outliers are validated against the current threshold
- Repeated selections trigger a new map navigation request
- Map event listeners are cleaned up when dependencies change

### Error Handling

Validation errors include CSV row information while
preserving the original exception through Error.cause.

## Getting Started

### Prerequisites

- Node.js compatible with the project's Vite version
- npm

### Installation

```bash
git clone https://github.com/swl8521/gps-filter-lab.git
cd gps-filter-lab
npm install
```

### Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## CSV Data Format

GPS Filter Lab supports CSV files containing raw and
filtered GPS coordinates.

### Example

```csv
run_id,sequence,recorded_at,raw_latitude,raw_longitude,filtered_latitude,filtered_longitude,accuracy,altitude
run-001,0,1700000000000,37.500000,127.000000,37.500000,127.000000,5.0,30.0
run-001,1,1700000003000,37.500100,127.000100,37.500095,127.000098,6.0,30.5
```

### CSV Fields

| Field | Description |
| --- | --- |
| `run_id` | GPS tracking session identifier |
| `sequence` | Sequential index of a GPS point |
| `recorded_at` | Unix timestamp in milliseconds |
| `raw_latitude` | Original latitude |
| `raw_longitude` | Original longitude |
| `filtered_latitude` | Latitude after filtering |
| `filtered_longitude` | Longitude after filtering |
| `accuracy` | Reported horizontal GPS accuracy in meters |
| `altitude` | Reported altitude in meters |

Raw coordinates and altitude may contain missing values.

The current analysis assumes that the imported dataset
represents a single recording session with points in
recording order and unique sequence numbers.

## Project Structure

```text
src/
├── components/
│   ├── GpsMap.tsx
│   └── MapLegend.tsx
├── types/
│   └── gps.ts
├── utils/
│   ├── parseGpsCsv.ts
│   ├── haversine.ts
│   ├── gpsStats.ts
│   ├── gpsSpeed.ts
│   ├── gpsOutliers.ts
│   └── gpsSpeedComparison.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Development Roadmap

### Phase 1 — GPS Data Analysis

- [x] Initialize React and TypeScript project
- [x] CSV file import and parsing
- [x] GPS data validation
- [x] Haversine distance calculation
- [x] GPS correction distance statistics
- [x] Raw and filtered distance comparison
- [x] GPS speed calculation
- [x] Configurable speed outlier detection
- [x] Speed outlier classification
- [x] Interactive map visualization
- [x] Table-to-map selection
- [x] Map legend
- [ ] Bidirectional map and table selection
- [ ] GPS speed and accuracy charts

### Phase 2 — Project Quality

- [ ] Provide synthetic sample datasets
- [ ] Add automated unit tests
- [ ] Configure GitHub Actions CI
- [ ] Publish an interactive web demo
- [ ] Document technical decisions

### Phase 3 — GPS Filtering Experiments

- [ ] Accuracy-based GPS filtering
- [ ] Median/MAD outlier detection
- [ ] Kalman filter implementation
- [ ] Configurable filtering parameters
- [ ] Filtering algorithm comparison
- [ ] Performance benchmarking
- [ ] Analysis report export

## Limitations

- The current application analyzes GPS filtering results
  rather than executing filtering algorithms.
- Speed-based anomaly detection is a heuristic and
  does not establish whether a GPS measurement is incorrect.
- Some datasets contain only samples accepted by the
  original tracking application.
- Rejected samples cannot be reconstructed from
  accepted GPS records.
- Filtering accuracy cannot be established without
  suitable reference or ground-truth data.

## Privacy

GPS coordinates may reveal sensitive location information.

- CSV parsing and analysis are performed locally in the browser.
- No backend upload functionality is currently implemented.
- External map tile requests are required to display the map.
- Real user location data should not be committed to public repositories.
- Synthetic or anonymized datasets should be used for public examples.

## Related Project

### PaceLeague

A GPS-based running application where users claim
territories by completing running routes.

GPS Filter Lab was inspired by GPS tracking and
filtering challenges encountered during its development.

Website: https://paceleague.co.kr

## Contributing

Suggestions, bug reports, and contributions are welcome.

The project's APIs and internal structure may change
during active development.

## License

This project is licensed under the [MIT License](./LICENSE).
