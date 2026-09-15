# MEGH-SCAN 🌐

### AI-Assisted Geospatial Intelligence Platform for Meghalaya

MEGH-SCAN is an AI-assisted geospatial intelligence and infrastructure-risk analysis platform designed to help identify recurring infrastructure problems, analyze historical incidents, and prioritize locations for preventive inspection across Meghalaya.

The platform combines geospatial visualization, incident history, environmental indicators, citizen observations, and transparent priority scoring into one centralized dashboard.

> **Project Status:** Completed Prototype / Demonstration Project  
> **Region:** Meghalaya, India  
> **Developer:** Shubham

---

## 📌 Overview

Infrastructure-related problems such as landslides, road damage, drainage blockage, flooding, and recurring public-safety issues often repeat in the same locations.

MEGH-SCAN introduces a **Problem Memory** approach that stores historical incidents and connects them to specific geographic locations. Instead of viewing every incident as an isolated event, the platform helps users understand:

- Where problems repeatedly occur
- How frequently a location is affected
- How severe previous incidents were
- Whether the issue is becoming more active
- Which locations should receive preventive attention first

The goal is to support better planning, faster assessment, and data-informed infrastructure management.

---

## 🎯 Problem Statement

Many infrastructure issues are handled reactively after damage has already occurred. Historical reports may be scattered across departments, local records, and citizen complaints, making it difficult to identify recurring risk locations.

MEGH-SCAN addresses this challenge by providing a centralized platform for:

- Geographic incident visualization
- Historical problem tracking
- Recurring-location identification
- Priority-based inspection planning
- Citizen-submitted observations
- Transparent data analysis

---

## ✨ Key Features

### 🗺️ Interactive Geospatial Dashboard

- Interactive map of Meghalaya
- Incident markers and location-based visualization
- Risk and priority heatmap
- Location filters
- Incident-type filters
- Severity-based filtering
- Historical and active incident views

### 🧠 Problem Memory Timeline

The Problem Memory feature connects multiple incidents to the same location.

It helps users view:

- Previous incidents
- Incident dates
- Problem categories
- Severity levels
- Historical frequency
- Previous actions
- Current priority status

This allows recurring infrastructure problems to be analyzed over time.

### 📊 Transparent Priority Scoring

MEGH-SCAN uses a transparent scoring model to prioritize locations for inspection.

Example scoring structure:

| Factor | Weight |
|---|---:|
| Historical recurrence | 30% |
| Incident severity | 20% |
| Recent activity | 15% |
| Population or infrastructure exposure | 15% |
| Environmental indicators | 10% |
| Accessibility and connectivity | 10% |

> The score is intended for decision support and demonstration purposes. It is not an official government risk rating or an emergency warning system.

### 🚨 Incident Management

- View reported incidents
- Categorize infrastructure problems
- Assign severity levels
- Track incident status
- Store geographic coordinates
- View incident history
- Record recommendations and actions

### 👥 Citizen Observation Portal

Citizens can submit observations related to:

- Road damage
- Landslides
- Drainage problems
- Waterlogging
- Flooding
- Public infrastructure damage
- Other recurring local issues

Submitted observations can be reviewed and verified before being used in analysis.

### 📈 Analytics and Reports

- Incident trends
- Category-wise statistics
- Severity distribution
- Recurring problem locations
- Priority-ranked locations
- Historical activity charts
- Downloadable reports and datasets

### 📁 Dataset Management

- Import structured incident data
- Upload CSV datasets
- Review available records
- Manage demonstration data
- Display data-source information

### 📚 Methodology and Limitations

The platform includes a methodology section explaining:

- How the priority score is calculated
- What each factor means
- How incidents are categorized
- How data is interpreted
- What the platform cannot guarantee
- Why human verification is necessary

---

## 🖥️ Main Application Pages

```text
/
├── Landing Page
├── Dashboard
├── Interactive Map
├── Incidents
├── Incident Details
├── Locations
├── Location Details
├── Analysis
├── Reports
├── Submit Observation
├── Datasets
├── Methodology
├── Settings
└── Login
```

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite or Next.js
- Tailwind CSS
- shadcn/ui
- Leaflet or MapLibre
- Recharts
- React Hook Form
- TanStack Query

### Backend

- Node.js
- Express.js or Next.js API routes
- REST API architecture
- Zod validation

### Database

- PostgreSQL
- Supabase
- Prisma ORM, where applicable

### Development Tools

- Git
- GitHub
- VS Code
- npm
- ESLint
- Prettier

---

## 🏗️ System Architecture

```text
User
 │
 ▼
Frontend Interface
 │
 ▼
Application API
 │
 ├── Incident Management
 ├── Location Management
 ├── Citizen Observations
 ├── Priority Scoring Engine
 ├── Analytics Engine
 └── Report Generation
 │
 ▼
PostgreSQL / Supabase Database
```

The AI analysis layer is designed to support future integration with external AI providers. The platform can initially operate using a deterministic scoring and analysis engine rather than depending on an AI service for every result.

---

## 🧮 Priority Analysis Model

The platform generates a priority score based on multiple indicators:

```text
Priority Score =
    Recurrence Score
  + Severity Score
  + Recent Activity Score
  + Exposure Score
  + Environmental Score
  + Accessibility Score
```

The score is designed to help users identify locations that may require further inspection.

It should not be interpreted as:

- A guaranteed prediction
- An official disaster warning
- A replacement for field inspection
- A replacement for government emergency systems
- A substitute for professional engineering assessment

---

## 📍 Example Use Cases

MEGH-SCAN can support:

- Infrastructure inspection planning
- Recurring road-damage analysis
- Landslide-prone area documentation
- Drainage and waterlogging monitoring
- Local issue reporting
- Disaster-preparedness planning
- Public infrastructure maintenance
- Geographic data visualization
- Research and academic demonstrations

---

## 📂 Suggested Project Structure

```text
megh-scan/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── types/
│   └── data/
├── server/
├── prisma/
├── screenshots/
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

> The actual structure may vary depending on the implementation framework.

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shubhamcooks/megh-scan.git
```

### 2. Navigate to the Project

```bash
cd megh-scan
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file based on `.env.example`.

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
MAP_TILE_URL=
AI_API_KEY=
VITE_APP_NAME=MEGH-SCAN
VITE_APP_REGION=Shillong, Meghalaya
```

Do not commit the actual `.env` file or any private credentials.

### 5. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

The port may differ depending on the project configuration.

---

## 📦 Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

The available scripts may vary according to the project's `package.json`.

---

## 🧪 Demonstration Data

This project may include sample or seeded data for demonstration purposes.

The demonstration dataset should not be treated as:

- Official government data
- Verified emergency information
- Real-time disaster intelligence
- A certified risk assessment
- A replacement for field validation

Real-world deployment would require verified datasets, appropriate data governance, field verification, and coordination with relevant authorities.

---

## 🔐 Security and Privacy

The project follows basic security practices, including:

- Environment variables for sensitive configuration
- No hardcoded API keys
- Input validation
- Separation of frontend and backend logic
- Controlled access to administrative functions
- Protection of private user-submitted information

Before deploying publicly, ensure that:

- API keys are not exposed
- Database credentials are not committed
- Private datasets are excluded
- User information is handled responsibly
- Administrative routes are protected

---

## 🚧 Limitations

MEGH-SCAN is an AI-assisted decision-support prototype and has several limitations:

- Results depend on the quality and availability of data.
- Demonstration data may not represent real-world conditions.
- The platform does not guarantee future incident prediction.
- Environmental indicators may be incomplete.
- Citizen observations require verification.
- Map information may not be real-time.
- The platform is not an official emergency-alert system.
- Final decisions should involve qualified personnel and field inspection.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Real-time rainfall and weather-data integration
- Satellite imagery analysis
- Terrain and elevation analysis
- Automated landslide-susceptibility mapping
- IoT-based environmental sensors
- Government department dashboards
- SMS and email notifications
- Multilingual support
- Offline-first mobile application
- AI-assisted image-based damage classification
- Advanced GIS layers
- Role-based access control
- Field-inspection mobile tools
- Integration with verified public datasets

---

## 🌍 Project Vision

MEGH-SCAN aims to demonstrate how geospatial technology, historical data, artificial intelligence, and citizen participation can work together to support preventive infrastructure planning.

The long-term vision is to help communities and authorities move from:

```text
Reactive Problem Handling
          ↓
Historical Understanding
          ↓
Data-Informed Prioritization
          ↓
Preventive Planning
```

---

## 👨‍💻 Developer

**Shubham**

- GitHub: [@shubhamcooks](https://github.com/shubhamcooks)
- GitHub Profile: https://github.com/shubhamcooks

---

## 📄 License

This project is licensed under the **MIT License**.

You can find the full license text in the [LICENSE](LICENSE) file.

---

## ⚠️ Disclaimer

MEGH-SCAN is an educational and demonstration project. It is not affiliated with, endorsed by, or operated by any government department unless explicitly stated.

The platform must not be used as the sole source for emergency decisions, disaster warnings, engineering assessments, or public-safety actions.

---

⭐ If you find this project useful or interesting, consider starring the repository.