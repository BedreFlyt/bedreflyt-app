# BedreFlyt App

A React and Electron application for hospital bed allocation, patient management, and allocation simulation. The application communicates with a backend REST API and can run as a desktop application (Electron), a standalone web application, or a containerised web service (Docker).

---

## Table of Contents

- [BedreFlyt App](#bedreflyt-app)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Install Dependencies](#install-dependencies)
    - [Environment Variables](#environment-variables)
    - [Run as a Web Application](#run-as-a-web-application)
    - [Run as a Desktop Application (Electron)](#run-as-a-desktop-application-electron)
  - [Building for Production](#building-for-production)
    - [Web Build](#web-build)
    - [Electron Distribution](#electron-distribution)
    - [Docker](#docker)
  - [Application Structure](#application-structure)
  - [Pages and Navigation](#pages-and-navigation)
  - [API Integration](#api-integration)
  - [Simulation Scenarios](#simulation-scenarios)

---

## Overview

BedreFlyt is a hospital operations support tool built as part of a research project at the University of Oslo (`no.uio.bedreflyt`). It provides a graphical interface to manage patient records, visualise and perform bed allocations across hospital wards, run allocation simulations, and inspect underlying data entities. The embedded API documentation viewer exposes the backend's Swagger UI directly inside the application.

---

## Features

- **Patient Management** — Create, edit, and delete patient records with fields for name, address, city, birthdate, and gender. Paginated table view with 15 records per page.
- **Bed Allocation** — Manually assign patients to beds within a ward, selecting diagnosis, care categories, and room numbers.
- **Allocation Simulation** — Upload a scenario file and run what-if simulations against the optimisation backend. Supports daily and global solve modes, worst-case and common-case assumptions, and stochastic multi-simulation with a configurable risk parameter.
- **Current Allocations** — View the live allocation state returned by the backend.
- **Data Inspector** — Browse all reference data entities (patients, treatments, rooms, tasks, diagnoses, monitoring categories, cities, wards, hospitals) in tabbed tables.
- **API Documentation** — Embedded Swagger UI served by the backend, accessible directly inside the app.
- **Collapsible Sidebar** — Icon-based navigation that expands to show labels.

---

## Technology Stack

| Layer | Technology |
|---|---|
| UI framework | React 19, TypeScript |
| Component library | React Bootstrap 2, Bootstrap 5 |
| Charting | Recharts 2, React ApexCharts |
| HTTP client | Axios |
| Routing | React Router 7 |
| Notifications | React Toastify |
| Desktop shell | Electron 34 |
| Packaging | electron-builder |
| Container runtime | Docker (nginx:stable-alpine) |

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- A running instance of the BedreFlyt backend API (default: `http://localhost:8090`)
- Docker (optional, for containerised deployment)

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. Both variables are optional; the defaults work when the backend runs on the same machine.

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_COMPLETE_URL` | `http://localhost:8090` | Full base URL for all backend API calls |
| `REACT_APP_BASE_URL` | `localhost` | Hostname used to construct the Swagger UI URL |

Example `.env`:

```
REACT_APP_COMPLETE_URL=http://my-backend-host:8090
REACT_APP_BASE_URL=my-backend-host
```

### Run as a Web Application

```bash
npm start
```

Opens the app in your default browser at `http://localhost:3000`.

### Run as a Desktop Application (Electron)

To start both the React dev server and the Electron window together:

```bash
npm run start-electron
```

To start Electron against an already-running React dev server:

```bash
npm run electron
```

---

## Building for Production

### Web Build

```bash
npm run build
```

Outputs a production-optimised bundle to the `build/` directory.

### Electron Distribution

```bash
npm run dist
```

Packages the Electron application using electron-builder. Output is placed in the `dist/` directory. The application ID is `no.uio.bedreflyt.app` and the product name is `Bedrefly application`.

### Docker

The included `Dockerfile` performs a two-stage build: it compiles the React app with Node 18 Alpine and then serves the static output with nginx on port 80. The `nginx.conf` configures `try_files` to support client-side routing.

```bash
# Build the image
docker build -t bedreflyt-app .

# Run the container
docker run -p 8080:80 bedreflyt-app
```

The application will be available at `http://localhost:8080`.

Note: when running inside Docker, set `REACT_APP_COMPLETE_URL` at build time if the backend is not reachable at `http://localhost:8090` from within the container.

```bash
docker build --build-arg REACT_APP_COMPLETE_URL=http://backend-host:8090 -t bedreflyt-app .
```

---

## Application Structure

```
bedreflyt-app/
├── electron.js            # Electron main process
├── preload.js             # Electron preload script
├── nginx.conf             # nginx configuration for Docker
├── Dockerfile             # Multi-stage Docker build
├── public/                # Static HTML, manifest, robots
└── src/
    ├── App.js             # Root component and route definitions
    ├── components/
    │   └── ui/
    │       ├── allocations.tsx          # Current allocations view
    │       ├── bed-allocation.tsx       # Manual allocation form
    │       ├── bed-simulation.tsx       # Simulation panel
    │       ├── custom-pagination.tsx    # Pagination component
    │       ├── data-table.tsx           # Generic data table
    │       ├── navbar.tsx               # Top navigation bar
    │       ├── patients-distribution.tsx # Patient distribution chart
    │       ├── search-modal.tsx         # Search overlay
    │       └── sidebar.tsx              # Collapsible sidebar
    ├── pages/
    │   ├── home-page.tsx        # Landing page
    │   ├── patients.tsx         # Patient CRUD management
    │   ├── bed-allocation.tsx   # Allocation and simulation page
    │   ├── inspect-data.tsx     # Reference data browser
    │   └── api-documentation.tsx # Embedded Swagger UI
    ├── services/
    │   └── apiService.ts        # All HTTP calls to the backend
    └── types/
        └── types.ts             # TypeScript types and table column definitions
```

---

## Pages and Navigation

| Route | Page | Sidebar Label |
|---|---|---|
| `/` | Home | — |
| `/patients` | Patient Management | Patients management |
| `/bed-allocation` | Bed Allocation & Simulation | Bed allocation |
| `/inspect` | Data Inspector | Browse data |
| `/docs` | API Documentation | API inspection |

The sidebar also lists **Hospital Ward**, **Staff adjustments**, and **Staff allocation** entries, which are placeholders for future sections.

---

## API Integration

All requests to the backend are centralised in `src/services/apiService.ts`. GET responses are cached in `localStorage` for 60 minutes to reduce redundant network traffic. The cache entry for a given URL is invalidated when it expires; a `QuotaExceededError` is caught and logged without crashing the application.

The backend is expected to expose the following endpoint groups under the base URL:

| Path | Description |
|---|---|
| `/api/v1/patients` | Patient records |
| `/api/v1/patient-allocations` | Current bed allocations |
| `/api/v1/treatments` | Treatment records |
| `/api/v1/rooms` | Room data |
| `/api/v1/tasks` | Task records |
| `/api/v1/diagnoses` | Diagnosis codes |
| `/api/v1/monitoring-categories` | Monitoring category definitions |
| `/api/v1/cities` | City reference data |
| `/api/v1/wards` | Ward definitions |
| `/api/v1/hospitals` | Hospital records |
| `/swagger-ui.html` | Swagger UI (rendered in the Docs page) |

Simulation endpoints are also consumed for the bed simulation feature (daily, global, and multi-simulation variants).

---

## Simulation Scenarios

The simulation panel accepts a plain-text scenario file where each line describes one patient event:

```
{batch} {patientId} {diagnosis}
```

**Example:**

```
1 P001 J18.0
1 P002 K35.8
2 P003 I21.0
```

**Solve type** controls the optimisation horizon:

- `daily` — optimise allocations for the current day
- `global` — optimise across all batches simultaneously

**Case type** controls how uncertainty is handled:

- `common` — expected-case assumptions
- `worst` — worst-case assumptions
- `stochastic` — probabilistic multi-simulation; uses a configurable **risk** parameter (0.0–1.0) and runs multiple repetitions

Results are displayed as a paginated allocation table alongside a change count.
