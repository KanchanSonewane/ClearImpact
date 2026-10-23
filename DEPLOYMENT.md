# ClearImpact Production Deployment & MongoDB Setup Guide

ClearImpact is structured as a unified full-stack application. In production, a single Node.js process runs the backend Express API (`/api/*`) and serves the compiled React client (`/*`) from `client/dist`.

---

## 1. MongoDB Database Options

ClearImpact supports both cloud-hosted persistent MongoDB and zero-config in-memory fallback.

### Option A: Free Cloud Database with MongoDB Atlas (Recommended)
MongoDB Atlas provides a 100% free permanent 512MB M0 cluster:

1. **Create an Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for free.
2. **Create a Free Cluster**:
   - Select **M0 Free** (Shared).
   - Provider: AWS / Google Cloud (choose region closest to you, e.g. Mumbai `ap-south-1`).
   - Click **Create Deployment**.
3. **Set Up Security & Credentials**:
   - **Database Access**: Create a database user (e.g., username: `clearimpact_admin`, set a strong password).
   - **Network Access**: Add an IP address rule: Click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`) so cloud servers (Render, Railway, etc.) can reach it.
4. **Get Connection String**:
   - Click **Connect** -> Choose **Drivers** (Node.js).
   - Copy the connection URI:
     ```
     mongodb+srv://clearimpact_admin:<password>@cluster0.xxxxx.mongodb.net/clearimpact?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password.
5. **Set the Environment Variable**:
   - In production dashboard (Render / Railway / Heroku): Set `MONGODB_URI` to this connection string.
   - For local testing: Paste it into `server/.env` under `MONGODB_URI`.

---

### Option B: Zero-Config In-Memory Fallback (Demo / Development)
If `MONGODB_URI` is left blank, ClearImpact automatically launches its embedded in-memory MongoDB instance and pre-seeds demonstration campaigns, verified NGOs, and milestones. Data resets on process restart.

---

### Option C: Docker Self-Hosted MongoDB
If you prefer hosting your own MongoDB instance using Docker:
```bash
docker-compose up -d
```
This automatically boots a persistent MongoDB 7.0 database and ClearImpact container on `http://localhost:5000`.

---

## 2. Deploy to Cloud Providers

### Deploy on Render (Recommended Free Tier)
1. Fork or push this repository to GitHub: `https://github.com/KanchanSonewane/ClearImpact`.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure service parameters:
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `(any random 32+ character string)`
   - `MONGODB_URI`: `(your MongoDB Atlas connection string from Step 1)`
   - `GEMINI_API_KEY`: `(your Google Gemini API key from https://aistudio.google.com/)`
   - `RAZORPAY_KEY_ID`: `(optional - test key or rzp_test_sandbox)`
   - `RAZORPAY_KEY_SECRET`: `(optional - test key or sandbox_secret)`
6. Click **Deploy Web Service**. Render will build the client, connect to MongoDB, and provide a live `https://clearimpact-xxxx.onrender.com` URL.

---

### Deploy on Railway
1. Go to [railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub repo** and pick `ClearImpact`.
3. Add a **MongoDB** service from Railway's template if you don't have MongoDB Atlas (Railway provides a 1-click MongoDB plugin).
4. In your web service settings, add your environment variables (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`).
5. Railway will automatically execute `npm run build` and `npm start`.

---

### Deploy with Docker
```bash
# 1. Clone repository
git clone https://github.com/KanchanSonewane/ClearImpact.git
cd ClearImpact

# 2. Configure environment
cp .env.example .env

# 3. Launch with Docker Compose
docker-compose up -d --build
```
Your instance will be running on `http://localhost:5000`.

---

## 3. Seeded Accounts & Credentials

On first boot on an empty database, ClearImpact automatically initializes these demonstration accounts:

| Role | Email | Password |
|---|---|---|
| **Platform Compliance Admin** | `admin@clearimpact.org` | `admin123` |
| **Verified NGO Partner (Vidya Foundation)** | `ngo@vidya.org` | `ngo123` |
| **Verified NGO Partner (Aarogya Seva)** | `ngo@aarogya.org` | `ngo123` |
| **Verified Donor** | `donor@clearimpact.org` | `donor123` |
