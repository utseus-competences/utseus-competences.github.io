# UTSEUS Career Competency System - Future Extension Guide

> **For Future AI Developers**: This document provides comprehensive guidance on the system architecture, extension patterns, and best practices for maintaining and extending this project.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Deep Dive](#architecture-deep-dive)
3. [Data Structure](#data-structure)
4. [Extension Patterns](#extension-patterns)
5. [Multi-Language Support](#multi-language-support)
6. [Common Tasks](#common-tasks)
7. [File Organization](#file-organization)

---

## System Overview

### Core Concept: Career → Competency → Course → GAP

This is a **Competency-driven Curriculum Recommender System** that follows a four-layer architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Career Goals (20 profiles)                        │
│  - AI Engineer, Robotics Engineer, CPS Engineer, etc.       │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Competency Model (4 Modules × 11 BCs)             │
│  - M1: CPS Engineering (BC1-BC5)                            │
│  - M2: Research & Innovation (BC6-BC7, BC10)                │
│  - M3: Engineering Practice (BC9)                           │
│  - M4: Communication & Social (BC8, BC11)                   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: Course Database (70+ courses)                     │
│  - Each course contributes 0-3 points to specific BCs       │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4: GAP Analysis Engine                               │
│  - Target vector (Career) - Current vector (Courses) = GAP  │
└─────────────────────────────────────────────────────────────┘
```

### Key Innovation: Weighted Competency Vectors

Unlike simple yes/no matching, this system uses **weighted competency vectors**:

```javascript
// Career defines target vector
AI Engineer: {
  BC1: 3,  // High need for Data Analysis
  BC3: 3,  // High need for System Modeling
  BC10: 2, // Medium need for Critical Thinking
  // ...
}

// Courses contribute to current vector
Machine Learning: {
  BC1: +3,  // Strong contribution
  BC3: +2,  // Medium contribution
  BC10: +2  // Medium contribution
}

// GAP = Target - Current (capped at 3 per BC)
```

---

## Architecture Deep Dive

### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Vue 3 + Composition API | UI components |
| State | Pinia | Global state management |
| Routing | Vue Router | SPA navigation |
| Build | Vite | Fast development & bundling |
| Charts | Chart.js + vue-chartjs | Radar chart visualization |
| Deploy | GitHub Pages | Static hosting |

### Why These Choices?

1. **Vue 3 (not React)**: Lighter weight, better for static sites, easier for future maintainers
2. **Pinia (not Vuex)**: Official recommendation, simpler API, better TypeScript support
3. **No UI Framework**: Custom CSS allows precise UTSEUS branding control
4. **Chart.js**: Provides radar chart with good customization and smaller bundle than full charting libraries

### Core Engine: `src/core/gapEngine.js`

This is the **brain** of the system. All calculations happen here:

```javascript
// Key functions:
calculateCurrentBC(selectedCourses)     // Sum course contributions
calculateGap(career, currentBC)         // Target - Current
generateRecommendations(gap)            // Course suggestions
calculateMatchPercentage(gap)           // Overall fit score
generateLearningPath(recommendations)   // Ordered steps
```

**Important**: Keep this file pure (no Vue dependencies). It should be testable in isolation.

---

## Data Structure

### 1. Competencies (`src/data/competencies.json`)

```typescript
interface CompetencySystem {
  modules: {
    [moduleId: string]: {
      id: string;           // "M1", "M2", "M3", "M4"
      name: string;         // English name
      nameFr: string;       // French name (for i18n prep)
      description: string;
      color: string;        // Hex color for UI
      icon: string;         // Future: icon name
    }
  };
  bc: {
    [bcId: string]: {
      id: string;           // "BC1" to "BC11"
      name: string;         // Full name
      nameFr: string;       // French name
      module: string;       // Parent module ID
      description: string;
      shortDesc: string;    // For UI labels
      core?: boolean;       // Mark key competencies
    }
  };
}
```

### 2. Careers (`src/data/careers.json`)

```typescript
interface Career {
  id: string;             // snake_case identifier
  name: string;           // Display name
  nameFr: string;         // French name
  category: string;       // For grouping in UI
  description: string;
  bcWeights: {
    [bcId: string]: number;  // 0-3 weight per BC
  };
  coreFocus: string[];    // Highlighted BCs (2-4 items)
  requiredLevel: string;  // "M1", "M1+M2", etc.
}
```

**Adding a New Career**:
1. Add entry to `careers.json`
2. Define `bcWeights` for all 11 BCs (use 0 if not relevant)
3. Pick 2-4 BCs as `coreFocus`
4. Assign to appropriate `category`

### 3. Courses (`src/data/courses.json`)

```typescript
interface Course {
  id: string;             // snake_case identifier
  name: string;           // English name
  nameCn: string;         // Chinese name (if applicable)
  level: "undergraduate" | "graduate";
  credits: number;
  bcContribution: {
    [bcId: string]: number;  // 0-3 contribution per BC
  };
}
```

**Adding a New Course**:
1. Add entry to `courses.json`
2. Define `bcContribution` (only include BCs with value > 0)
3. Add entry to `bcToCourses.json` for each BC it contributes to

### 4. BC-to-Courses Index (`src/data/bcToCourses.json`)

Reverse index for fast lookups:

```typescript
interface BCToCourses {
  [bcId: string]: string[];  // Array of course IDs
}
```

**Important**: Keep this in sync with `courses.json`. When adding a course:
1. Add course to `courses.json`
2. Add course ID to relevant BC arrays in `bcToCourses.json`

---

## Extension Patterns

### Pattern 1: Adding a New Competency (BC)

**Use case**: UTSEUS decides to add BC12 for "Digital Ethics"

Steps:
1. Add BC12 definition to `competencies.json`:
   ```json
   "BC12": {
     "id": "BC12",
     "name": "Digital Ethics",
     "module": "M4",
     ...
   }
   ```

2. Add empty array to `bcToCourses.json`:
   ```json
   "BC12": []
   ```

3. Update all careers with BC12 weight (default 0)

4. Update `gapEngine.js` - BC list is dynamically generated, so no change needed

5. Update any Vue components that have hardcoded BC lists

### Pattern 2: Adding Multi-Language Support

**Current state**: English UI with French/Chinese names in data files

**Recommended approach**: Use `vue-i18n`

Implementation steps:

1. Install dependency:
   ```bash
   npm install vue-i18n@9
   ```

2. Create `src/i18n/index.js`:
   ```javascript
   import { createI18n } from 'vue-i18n'
   import en from './locales/en.json'
   import fr from './locales/fr.json'
   import zh from './locales/zh.json'

   export default createI18n({
     legacy: false,
     locale: 'en',
     fallbackLocale: 'en',
     messages: { en, fr, zh }
   })
   ```

3. Update `main.js`:
   ```javascript
   import i18n from './i18n'
   app.use(i18n)
   ```

4. Create locale files structure:
   ```
   src/i18n/
   ├── index.js
   └── locales/
       ├── en.json
       ├── fr.json
       └── zh.json
   ```

5. Replace static text with `$t()` keys:
   ```vue
   <!-- Before -->
   <h1>Career Competency Dashboard</h1>
   
   <!-- After -->
   <h1>{{ $t('dashboard.title') }}</h1>
   ```

6. Language switcher component:
   ```vue
   <select v-model="$i18n.locale">
     <option value="en">English</option>
     <option value="fr">Français</option>
     <option value="zh">中文</option>
   </select>
   ```

**Alternative**: If vue-i18n is too heavy for this use case, use a simple reactive object store in Pinia.

### Pattern 3: Adding User Accounts / Persistence

**Current state**: All data is client-side only (selected courses stored in memory)

**Options for persistence**:

1. **LocalStorage** (simplest):
   ```javascript
   // In appStore.js
   const saved = localStorage.getItem('utseus-courses')
   if (saved) {
     selectedCourses.value = JSON.parse(saved)
   }
   
   watch(selectedCourses, (val) => {
     localStorage.setItem('utseus-courses', JSON.stringify(val))
   }, { deep: true })
   ```

2. **Backend + Database** (more complex):
   - Add a backend (Node.js/Express, Fastify, or serverless)
   - Database: PostgreSQL or MongoDB
   - Auth: JWT tokens or session-based
   - API endpoints:
     - `POST /api/save-plan` - Save course selection
     - `GET /api/load-plan` - Load saved selection
     - `POST /api/share` - Generate shareable link

### Pattern 4: Adding Export / Report Generation

Generate PDF reports of the analysis:

1. Install `jspdf` and `html2canvas`:
   ```bash
   npm install jspdf html2canvas
   ```

2. Create export component:
   ```javascript
   import jsPDF from 'jspdf'
   import html2canvas from 'html2canvas'

   async function exportPDF() {
     const element = document.getElementById('dashboard-content')
     const canvas = await html2canvas(element)
     const pdf = new jsPDF('p', 'mm', 'a4')
     pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
     pdf.save('utseus-career-plan.pdf')
   }
   ```

### Pattern 5: Adding a New Visualization

Current: Radar chart for BC comparison

Ideas for new charts:
- Bar chart: Course coverage by module
- Sankey diagram: Course → BC → Career flow
- Timeline: Suggested semester plan

Implementation:
1. Create new component in `src/components/`
2. Use D3.js for complex visualizations, or stick with Canvas for simple ones
3. Add to Dashboard view

---

## Multi-Language Support

### Detailed Implementation Plan

**Phase 1: Prepare Data (Current State)**
- ✅ English names in primary fields
- ✅ French names in `nameFr` fields
- ✅ Chinese names in `nameCn` fields for courses

**Phase 2: UI Text Externalization**

Extract all UI strings to translation files:

```json
// src/i18n/locales/en.json
{
  "nav": {
    "home": "Home",
    "careers": "Careers",
    "courses": "Courses",
    "dashboard": "Dashboard",
    "path": "Learning Path"
  },
  "home": {
    "title": "Career-Driven Competency System",
    "subtitle": "Plan your engineering education at UTSEUS",
    "cta_start": "Start Analysis",
    "cta_explore": "Explore Careers"
  },
  "dashboard": {
    "title": "Career Competency Dashboard",
    "select_career": "Select Your Career Goal after UTSEUS/UT master degree",
    "radar_title": "Competency Radar",
    "gap_title": "Gap Analysis",
    "recommendations_title": "Course Recommendations"
  },
  "status": {
    "satisfied": "Satisfied",
    "minor": "Minor Gap",
    "important": "Important Gap",
    "critical": "Critical Gap"
  },
  "modules": {
    "M1": "CPS Engineering Capability",
    "M2": "Research & Innovation",
    "M3": "Engineering Practice",
    "M4": "Communication & Social"
  }
}
```

```json
// src/i18n/locales/fr.json
{
  "nav": {
    "home": "Accueil",
    "careers": "Carrières",
    "courses": "Cours",
    "dashboard": "Tableau de bord",
    "path": "Parcours d'apprentissage"
  },
  ...
}
```

**Phase 3: Dynamic Data Translation**

For data from JSON files (careers, courses), use a translation helper:

```javascript
// src/composables/useTranslation.js
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDataTranslation() {
  const { locale } = useI18n()
  
  const getCareerName = (career) => {
    return locale.value === 'fr' ? career.nameFr : career.name
  }
  
  const getBCName = (bc) => {
    const bcData = competencies.bc[bc]
    if (locale.value === 'fr') return bcData.nameFr
    return bcData.name
  }
  
  return { getCareerName, getBCName }
}
```

**Phase 4: RTL Considerations**

Not needed for EN/FR/ZH, but if adding Arabic later:
```css
[dir="rtl"] .some-component {
  flex-direction: row-reverse;
}
```

---

## Common Tasks

### Task: Update a Course's BC Contribution

1. Edit `src/data/courses.json`
2. Update `src/data/bcToCourses.json` (add/remove from BC arrays)
3. Test in Dashboard - changes reflect immediately (hot reload)

### Task: Change Career Weights

1. Edit `src/data/careers.json`
2. Adjust `bcWeights` object
3. Check Dashboard - radar chart and recommendations update automatically

### Task: Fix Bug in GAP Calculation

1. Locate issue in `src/core/gapEngine.js`
2. Fix the pure function
3. Add unit test (if testing framework added):
   ```javascript
   // Example test structure
   test('calculateGap correctly identifies critical gaps', () => {
     const career = { bcWeights: { BC1: 3 }, coreFocus: ['BC1'] }
     const current = { BC1: 0 }
     const gap = calculateGap(career, current)
     expect(gap.BC1.status).toBe('critical')
   })
   ```

### Task: Add New Page

1. Create view component: `src/views/NewPage.vue`
2. Add route in `src/router/index.js`
3. Add nav link in `src/components/AppHeader.vue`
4. Update this documentation

---

## File Organization

```
src/
├── components/           # Reusable UI components
│   ├── AppHeader.vue     # Navigation
│   ├── AppFooter.vue     # Footer
│   ├── CareerSelector.vue
│   ├── CourseSelector.vue
│   ├── BCRadarChart.vue  # Chart.js radar chart
│   ├── GapAnalysis.vue   # Gap display component
│   └── RecommendationPanel.vue
│
├── core/                 # Business logic (pure functions)
│   └── gapEngine.js      # All calculation logic
│
├── data/                 # Static JSON data
│   ├── careers.json      # 20 career profiles
│   ├── courses.json      # 70+ courses
│   ├── competencies.json # BC and Module definitions
│   └── bcToCourses.json  # Reverse lookup index
│
├── stores/               # State management
│   └── appStore.js       # Pinia store with computed getters
│
├── composables/          # Shared logic
│   └── useTooltip.js     # Tooltip directive
│
├── views/                # Page-level components
│   ├── Dashboard.vue     # Main analysis page (home)
│   ├── CourseExplorer.vue
│   ├── CareerExplorer.vue
│   └── LearningPath.vue
│
├── i18n/                 # [FUTURE] Internationalization
│   ├── index.js
│   └── locales/
│       ├── en.json
│       ├── fr.json
│       └── zh.json
│
├── router/
│   └── index.js          # Vue Router configuration
│
├── App.vue               # Root component
├── main.js               # Entry point
└── style.css             # Global styles + CSS variables
```

---

## Quick Reference: Technology Decisions

| Decision | Rationale |
|----------|-----------|
| Vue 3 (not React) | Lighter, better for static sites, French-friendly community |
| No TypeScript | Keep it simple for future maintainers; add later if needed |
| Pinia (not Vuex) | Official recommendation, simpler API |
| No UI library | Full control over UTSEUS branding |
| Chart.js | Provides radar chart with good customization |
| JSON files (not DB) | Static hosting on GitHub Pages; no backend needed |
| GitHub Pages | Free, integrated with repo, automatic deploys |

---

## Contact & Context

- **Institution**: UTSEUS, Shanghai University
- **Full Name**: l'Université de technologie sino-européenne, Université de Shanghai
- **Focus**: CPS (Cyber-Physical Systems) engineering education
- **Target Users**: Graduate and undergraduate engineering students
- **Current Version**: English UI, French/Chinese data names

---

**Last Updated**: April 2026
**Next Review**: When adding multi-language UI or backend features
