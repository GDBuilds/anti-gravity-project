# ClientFlow AI — Gym CRM Platform

ClientFlow AI (Gymshark Gym CRM) is a modern, premium CRM platform built for fitness businesses. Manage customers, track sales leads with a kanban board, automate notifications/reminders via WhatsApp/Email, handle invoices, and manage documents seamlessly.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (installed automatically with Node)

---

## 🛠️ Step-by-Step Installation

### 1. Install Dependencies
Run the following command in the root folder of the project to install all required packages:
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory of the project. You can copy the template from `.env.example`:
```bash
cp .env.example .env
```
Open your newly created `.env` file and replace the placeholder values with your actual Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Run the Database Schema in Supabase
To set up your database tables, foreign keys, row-level security (RLS) policies, and automatic user profile synchronization:
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Click on your project and navigate to the **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Open the [supabase_schema.sql](./supabase_schema.sql) file from this project.
5. Copy its entire content, paste it into the Supabase SQL Editor, and click **Run**.
6. *That's it!* Your database tables and trigger functions are now ready.

---

## 🏃 Running the Application

To run the entire stack concurrently (both the frontend and backend servers), use:
```bash
npm start
```

This single command boots up:
* **Frontend Client (Vite + React)**: [http://localhost:5173/](http://localhost:5173/)
* **Backend Mock Server (Express)**: [http://localhost:3001/](http://localhost:3001/) (simulates features like mock WhatsApp alerts)

### Running Separately
If you prefer to run the client and backend servers in separate terminal windows:
* Run the React frontend: `npm run dev`
* Run the mock Express server: `npm run server`

---

## 🔑 How to Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://database.new).
2. Create a new project (or select an existing one).
3. Once the project is provisioned, go to **Project Settings** (the gear icon at the bottom-left of the sidebar).
4. Click on **API** under the settings menu.
5. Under **Project API keys**, copy the **`anon` `public`** key (this is your `VITE_SUPABASE_ANON_KEY`).
6. Under **Project Configuration**, copy the **`URL`** (this is your `VITE_SUPABASE_URL`).
7. Paste these values into your `.env` file.

---

## 📦 Building for Production

To create an optimized, minified production build of your frontend client, run:
```bash
npm run build
```
The built assets will be placed in the `/dist` directory, ready to be deployed to services like Vercel, Netlify, or AWS.
