# Mapify — Workout Tracking Application

A location-based workout tracking application built with vanilla JavaScript and the Leaflet mapping library. The application allows users to log running, cycling, and walking workouts directly on an interactive map while persisting data using local storage.

# Live website - https://pragathesh-1111.github.io/Mapify/
---

## Overview

Mapify is a front-end project focused on practicing modern JavaScript development concepts including:

- Object-Oriented Programming (OOP)
- ES6 Classes & Inheritance
- DOM Manipulation
- Geolocation API
- Local Storage
- Dynamic UI Rendering
- Third-party API integration with Leaflet.js

Users can select a location on the map, enter workout details, and instantly visualize their activities both on the map and inside the workout list panel.

---

## Features

- Interactive map integration using Leaflet.js
- Real-time geolocation detection
- Workout creation for:
  - Running
  - Cycling
  - Walking
- Automatic pace and speed calculations
- Dynamic workout rendering
- Click-to-focus workout navigation
- Persistent data storage using Local Storage
- Clean responsive interface

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling & Layout |
| JavaScript (ES6+) | Application Logic |
| Leaflet.js | Interactive Maps |
| OpenStreetMap | Map Tiles & Data |

---

## Project Structure

```bash
mapty-workout-tracker/
│
├── index.html
├── style.css
├── script.js
├── logo.png
└── README.md
```

---

## Application Workflow

1. User grants location access
2. Application loads the map centered on the user's position
3. User clicks on a map location
4. Workout form appears
5. User submits workout details
6. Workout is rendered:
   - As a marker on the map
   - As an entry inside the sidebar
7. Data is saved to Local Storage

---

## Key JavaScript Concepts Implemented

### Object-Oriented Architecture

The application uses class-based architecture with inheritance:

- `Workout` → Base class
- `Running`
- `Cycling`
- `Walking`

Each workout type contains its own specialized calculations and properties.

### Encapsulation

Private class fields are used to protect internal application state:

```js
#map;
#mapEvent;
#workouts = [];
```

### Local Storage Persistence

Workout data is serialized and restored while maintaining class inheritance functionality.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/mapty-workout-tracker.git
```

Open the project directory:

```bash
cd mapty-workout-tracker
```

Run the application using Live Server or open `index.html` directly in the browser.

---

## Dependencies

### Leaflet.js

https://leafletjs.com

### OpenStreetMap

https://www.openstreetmap.org

---

## Future Improvements

- Workout editing
- Workout deletion
- Sorting & filtering
- Mobile optimization
- Dark mode support
- Route visualization
- Backend/database integration
- User authentication

---

## Author

**Pragatheshwaran**

---

## License

This project is made for learning purposes only.
