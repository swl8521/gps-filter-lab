# GPS Filter Lab

**GPS Filter Lab** is an open-source project for analyzing GPS tracking data and comparing raw GPS coordinates with filtered results.

The project aims to help developers understand how GPS filtering affects recorded trajectories, identify positioning anomalies, and evaluate different filtering algorithms.

## Project Status

🚧 **Early Development — Work in Progress**

The project is currently in its initial development phase.

### Implemented Features

- CSV file selection and reading
- GPS data parsing with Papa Parse
- TypeScript interfaces for GPS records
- Basic GPS data preview
- Display of parsed GPS point counts

### Planned Features

- GPS coordinate validation
- Raw vs. filtered trajectory visualization
- Distance calculation using the Haversine formula
- GPS correction distance statistics
- Accuracy-based data analysis
- Median/MAD outlier detection
- Kalman filter implementation and comparison
- GPS filtering benchmark tools
- Analysis report export

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React, TypeScript |
| Build Tool | Vite |
| CSV Parsing | Papa Parse |
| Linting | ESLint |
| Styling | CSS |

Additional libraries will be introduced as development progresses.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/swl8521/gps-filter-lab.git
cd gps-filter-lab
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, typically:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

## CSV Data Format

GPS Filter Lab initially supports CSV files containing raw and filtered GPS coordinates.

Example:

```csv
run_id,sequence,recorded_at,raw_latitude,raw_longitude,filtered_latitude,filtered_longitude,accuracy,altitude
run-001,0,1700000000000,37.500000,127.000000,37.500000,127.000000,5.0,30.0
run-001,1,1700000003000,37.500100,127.000100,37.500095,127.000098,6.0,30.5
```

### CSV Fields

| Field | Description |
|---|---|
| `run_id` | Unique identifier for a GPS tracking session |
| `sequence` | Sequential index of a GPS point |
| `recorded_at` | Unix timestamp in milliseconds |
| `raw_latitude` | Original GPS latitude |
| `raw_longitude` | Original GPS longitude |
| `filtered_latitude` | Latitude after filtering |
| `filtered_longitude` | Longitude after filtering |
| `accuracy` | Reported horizontal GPS accuracy in meters |
| `altitude` | Reported altitude in meters |

The current parser supports this CSV structure. Comprehensive input validation is planned.

## Project Structure

```text
src/
├── types/
│   └── gps.ts
├── utils/
│   └── parseGpsCsv.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Development Roadmap

- [x] Initialize React + TypeScript project
- [x] Implement CSV file selection
- [x] Read CSV file contents
- [x] Define GPS data types
- [x] Implement basic CSV parsing
- [ ] Validate GPS coordinates and timestamps
- [ ] Calculate GPS correction distances
- [ ] Visualize raw and filtered trajectories
- [ ] Implement statistical analysis
- [ ] Compare GPS filtering algorithms
- [ ] Add automated tests
- [ ] Publish an interactive demo

## Background

This project originated from practical GPS tracking challenges encountered while developing a location-based running application.

GPS tracking can be affected by positioning errors, noisy measurements, and inconsistent location updates.

GPS Filter Lab is intended to provide a reproducible environment for examining these issues and evaluating filtering techniques.

**Data limitation:** Some tracking datasets contain only GPS samples accepted by the recording application. Such datasets can be used to compare stored raw and filtered coordinates, but they cannot reconstruct rejected samples or measure the rejection rate of the complete GPS input stream.

## Privacy

GPS coordinates may reveal sensitive location information.

- CSV files are processed locally in the browser.
- No backend upload functionality is currently implemented.
- Real user location data should not be committed to public repositories.
- Synthetic or anonymized datasets should be used for public examples.

## Contributing

Contributions, suggestions, and bug reports are welcome.

As the project is in early development, its APIs and internal structure may change.

## License

License to be determined.