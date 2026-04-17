# UTSEUS Career Competency System

Career-Driven Competency Curriculum System for UTSEUS (l'Université de technologie sino-européenne, Université de Shanghai) students.

## 🎯 Overview

This web application helps students:
- Explore 20+ engineering career paths
- Understand required competencies for each career
- Analyze their current course coverage
- Get personalized course recommendations
- Plan their learning path

## 🏗️ System Architecture

### Core Logic: Career → Competency → Course → Gap Analysis

1. **Career Selection**: Choose from 20+ career paths (AI Engineer, Robotics Engineer, CPS Engineer, etc.)
2. **Competency Model**: 11 BC (Basic Competencies) organized in 4 Modules
   - M1: CPS Engineering Capability
   - M2: Research & Innovation Capability
   - M3: Engineering Practice & Professional Capability
   - M4: Communication, Language & Cross-cultural Collaboration
3. **Course Database**: 70+ undergraduate and graduate courses with BC contributions
4. **GAP Analysis**: Compare target career requirements vs. current course coverage
5. **Recommendations**: Get personalized course suggestions to close competency gaps

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173`

### Deploy to GitHub Pages

The repository is configured with GitHub Actions for automatic deployment:

1. Push to `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at: `https://utseus-competences.github.io/`

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Vue components
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── CareerSelector.vue
│   │   ├── CourseSelector.vue
│   │   ├── BCRadarChart.vue
│   │   ├── GapAnalysis.vue
│   │   └── RecommendationPanel.vue
│   ├── core/
│   │   └── gapEngine.js    # GAP analysis core logic
│   ├── data/
│   │   ├── careers.json    # 20 career definitions
│   │   ├── courses.json    # 70+ courses with BC contributions
│   │   ├── competencies.json  # BC and Module definitions
│   │   └── bcToCourses.json   # Reverse index
│   ├── stores/
│   │   └── appStore.js     # Pinia state management
│   ├── composables/
│   │   └── useTooltip.js   # Tooltip directive composable
│   ├── views/
│   │   ├── Dashboard.vue    # Main analysis page (home)
│   │   ├── CourseExplorer.vue
│   │   ├── CareerExplorer.vue
│   │   └── LearningPath.vue
│   ├── router/
│   │   └── index.js        # Vue Router configuration
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
└── .github/workflows/deploy.yml
```

## 🎓 Data Model

### Career Schema
```json
{
  "id": "ai_engineer",
  "name": "AI Engineer",
  "bcWeights": {
    "BC1": 3, "BC3": 3, "BC10": 2, ...
  },
  "coreFocus": ["BC1", "BC3", "BC10"]
}
```

### Course Schema
```json
{
  "id": "machine_learning",
  "name": "Machine Learning",
  "level": "graduate",
  "credits": 2,
  "bcContribution": {
    "BC1": 3, "BC3": 2, "BC10": 2
  }
}
```

### Competency Schema
```json
{
  "BC1": {
    "name": "Data Analysis",
    "module": "M1",
    "description": "..."
  }
}
```

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: CSS Variables + Scoped Styles
- **Charts**: Chart.js with vue-chartjs
- **Deployment**: GitHub Pages

## 📝 Features

- ✅ 20 Engineering Career Profiles
- ✅ 70+ Courses (Undergraduate + Graduate)
- ✅ 11 BC Competencies in 4 Modules
- ✅ Interactive Course Selection
- ✅ GAP Analysis with Visual Indicators
- ✅ Radar Chart Visualization
- ✅ Personalized Course Recommendations
- ✅ Learning Path Generation
- ✅ Responsive Design

## 🤝 Contributing

This project is maintained by UTSEUS. For questions or suggestions, please open an issue.

## 📄 License

MIT License - Copyright (c) 2026 UTSEUS
