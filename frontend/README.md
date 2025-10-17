# React + TypeScript + Vite

📖 Overview

This is the frontend part of the full-stack project built with React (Vite) and Ruby on Rails API.
The goal of the app is to implement an online store with user registration, login, product browsing, and order management.

Frontend communicates with the backend (Rails API) hosted on the same Render app or via API URL (e.g. https://your-backend.onrender.com).

⚙️ Tech Stack

React 18

Vite — fast build tool

TypeScript

Axios — API communication

Redux Toolkit (if used for state)

Bootstrap / Tailwind / custom CSS (depending on your setup)

🧩 Project Structure
frontend/
├── src/
│   ├── components/      # UI components
│   ├── features/        # Redux slices or modules
│   ├── app/             # API logic (axios instance, endpoints)
│   ├── pages/           # Route pages
│   ├── main.tsx         # App entry point
│   └── App.tsx          # Routes and layout
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json

🚀 Getting Started (Local Development)
1️⃣ Install dependencies
cd frontend
npm install

2️⃣ Run development server
npm run dev


Then open http://localhost:5173
 in your browser.

🛠 API Configuration

By default, the app expects the backend API at:

http://localhost:3000


If your Rails API is deployed on Render, you can set the base URL in:
📄 src/app/api.ts

const api = axios.create({
  baseURL: "https://your-backend.onrender.com",
  withCredentials: true,
});

🏗 Build for Production

To create an optimized production build (used by Render):

npm run build


The built files will be placed in the dist/ directory.

🌐 Deployment on Render

When deploying together with Rails:

The Rails app should serve the built React files from frontend/dist.

Your Render build command should include:

cd frontend && npm install && npm run build


Rails bin/render-build.sh should precompile assets and handle build steps.

💡 Features

🔐 User registration & login (via Devise API)

🛍 Product browsing and search

🧾 Order creation and viewing

👑 Admin panel for users & items management

🌙 Modern responsive UI

🧰 Scripts
Command	Description
npm run dev	Run local dev server
npm run build	Build production bundle
npm run preview	Preview production build locally
npm run lint	Lint code (if ESLint installed)# shopFrontend
