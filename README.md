<div align="center">

# 🌿 Nourish — Mindful Nutrition & Google Health Sanctuary

### *An artisanal, zero-shame wellness companion connecting culinary mindfulness with real-time biometric telemetry.*

[![Built with Google AI](https://img.shields.io/badge/Built%20with-Google%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Google Build with AI Bootcamps](https://img.shields.io/badge/Google-Build%20with%20AI%20Bootcamps-34A853?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Gemini%20API-3.8%20Flash-EA4335?style=for-the-badge&logo=googlegemini&logoColor=white)](https://aistudio.google.com/)
[![Google Health API](https://img.shields.io/badge/Google%20Health%20API-Activity%20%26%20Fitness-FBBC05?style=for-the-badge&logo=googlefit&logoColor=black)](https://developers.google.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 🌟 Overview & Heritage

Developed as part of the **Google Build with AI Bootcamps**, **Nourish** re-imagines nutrition tracking through the lens of culinary mindfulness, cellular vitality, and self-compassion. Unlike restrictive calorie-shaming apps, Nourish combines **Google Gemini 3.8 Flash Multimodal AI** with the **Google Health API** to provide an intuitive, sensory-rich sanctuary for nourishment, hydration, and movement.

---

## ✨ Core Pillars & Features

### 1. 🏃‍♂️ Google Health API Integration
* **Scope**: `https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly`
* **Real-time Telemetry Synchronization**: Syncs daily steps, active calorie expenditure, and workout duration directly from your Google Health account.
* **Dynamic Energy Buffer**: Instead of a rigid calorie ceiling, your live Google Health active burn dynamically expands your daily nourishment cushion.
* **Dual Auth Protection**: Combines OAuth 2.0 user Bearer tokens with the Google Health API Project Key for API quota routing and auditing.

### 2. 🔐 Google OAuth 2.0 & Token Lifecycle
* **Consent-Based Architecture**: Server-side authorization flow requesting offline access for seamless token refresh.
* **Automatic Refresh**: Access tokens automatically refresh prior to expiration using stored refresh tokens without user friction.
* **Zero Secret Exposure**: Client secrets, refresh tokens, and internal keys never touch client browsers.

### 3. 📸 Gemini 3.8 Flash Multimodal AI Food Lens
* **Instant Plate Analysis**: Snap or upload a photo of your meal plate to identify discrete ingredients, portion weights (in grams), and macronutrients (protein, carbs, lipids).
* **Mindful Precision**: Delivers sensory, culinary ingredient breakdowns and fiber/micronutrient guidance with high confidence scores.
* **Custom Steppers**: Fine-tune portion weights directly in the viewfinder with tactile adjustments before logging.

### 4. 🍵 "Sage" — Mindful Nutrition AI Assistant
* **Harmonized Health Guidance**: Sage integrates your live daily targets, meals logged, fluid intake, and Google Health steps/active burn into warm, compassionate dietary recommendations.
* **Serene Tone**: Zero judgment or calorie shame; structured guidance around circadian rhythms, whole foods, and holistic living.

### 5. 💧 Tactile Carafe Hydration Tracking
* Mindful fluid anchor visualization with custom portion presets (morning water, post-walk glass, tea infusions).

---

## 🛠️ Architecture & Tech Stack

```
nourish-unified/
├── server.ts                    # Production Express server (OAuth, Gemini AI, Health API)
├── server/
│   ├── googleAuth.ts            # OAuth 2.0 authorization, code exchange & token refresher
│   ├── googleHealth.ts          # Google Health API client (exponential backoff & data parsing)
│   ├── geminiService.ts         # Gemini 3.8 Flash food vision & Sage chat companion
│   └── tokens.ts                # Server-side token store and session management
├── src/
│   ├── context/AppContext.tsx   # React state management for health, meals & auth
│   ├── screens/                 # Dashboard, Scanner, Diary, Hydration, Insights, Settings, Auth
│   ├── components/              # Header, BottomNav, Toast, Sage ChatBot
│   └── types/index.ts           # Strictly typed TypeScript interfaces
└── .env                         # Secure server-side environment variables
```

* **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, Motion (framer-motion), Lucide icons
* **Backend**: Express, `@google/genai` SDK, `cookie-parser`, `dotenv`, `tsx`
* **Google APIs**:
  * Google OAuth 2.0 (`https://accounts.google.com/o/oauth2/v2/auth`)
  * Google Health API (`https://health.googleapis.com/v4/users/me/`)
  * Google Gemini API (`models/gemini-3.8-flash`)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) v20+ (tested on Node v24)
* A Google Cloud Project with credentials
* A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Installation
```bash
git clone https://github.com/your-username/nourish-unified.git
cd nourish-unified
npm install
```

### 2. Environment Variables Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Populate the required environment variables:
```env
# Google Gemini AI API Key
GEMINI_API_KEY="your_gemini_api_key_here"

# Google Health API Key (Google Cloud Project)
GOOGLE_HEALTH_API_KEY="your_google_health_api_key_here"

# Google Cloud OAuth 2.0 Credentials (Web Application)
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
GOOGLE_HEALTH_SCOPE="https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly"

# Server Configuration
PORT=3000
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## ☁️ Google Cloud Console Setup

To connect Google OAuth and the Google Health API:

1. **Create an OAuth 2.0 Client ID**:
   * Navigate to **[Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)**.
   * Click **Create Credentials > OAuth client ID**.
   * Application type: **Web application**.
   * Under **Authorized redirect URIs**, add:
     ```
     http://localhost:3000/api/auth/google/callback
     ```
     *(For production, also add your deployed domain, e.g. `https://your-domain.com/api/auth/google/callback`)*

2. **Configure the OAuth Consent Screen**:
   * Go to **[OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)**.
   * Add the scope:
     ```
     https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly
     ```
   * While your application is in **Testing** publishing status:
     * Scroll down to **Test users**.
     * Click **+ ADD USERS** and enter your Google email address (e.g., `you@gmail.com`).

3. **Enable APIs**:
   * In **APIs & Services > Library**, ensure the **Google Health API** (and Health Connect / Fitness APIs) are enabled for your project.

---

## 🚢 Production Deployment

### 1. Build the Application
```bash
npm run build
```
This bundles the client assets into `dist/` with optimized compression and code splitting.

### 2. Run in Production Mode
```bash
NODE_ENV=production npm start
```
The Express server will automatically serve the production Vite bundle from `dist/` and handle all OAuth and AI API endpoints at `http://localhost:3000`.

### 3. Docker / Cloud Run Deployment
You can package Nourish with this lightweight Dockerfile:

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security & Privacy Practices

* **No Secret Leakage**: All API keys, Client Secrets, and tokens are evaluated strictly server-side.
* **Encrypted Storage**: User authentication state is managed via secure, HTTP-only, SameSite session cookies.
* **Least Privilege**: Nourish requests strictly read-only biometric scopes (`activity_and_fitness.readonly`).
* **Ethical AI**: Nourish's prompts forbid shaming or guilt around food choices, focusing on cellular resilience and mindful nourishment.

---

## 🏆 Acknowledgments

Proudly built for the **Google Build with AI Bootcamps** using **Google Cloud APIs** and **Google Gemini AI**. Special thanks to Google's developer community and mentors.

---

<div align="center">
  <sub>Nourish Sanctuary · Crafting mindful balance with Google AI & Google Health API.</sub>
</div>
