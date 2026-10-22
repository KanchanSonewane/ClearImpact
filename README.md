# CLEARIMPACT
### "Transparent NGO Donations with Verified Proof-of-Impact"

ClearImpact is an innovative, startup-grade full-stack web platform built for high-accountability philanthropic donations. It directly addresses the systemic trust deficit in non-profit donations by connecting verified NGOs and donors through **statutory verification**, **milestone-based fund escrow**, **explainable evidence risk scoring**, and **grounded AI outreach & reporting**.

---

## 1. Project Structure

```
D:\clearimpact\
├── client\                           # Frontend (React 18, Vite, Tailwind CSS)
│   ├── public\                       # Static public assets
│   ├── src\
│   │   ├── api\                      # Axios REST API client & interceptors
│   │   │   └── client.js
│   │   ├── components\
│   │   │   └── common\               # Reusable UI component library
│   │   │       ├── AdPosterPreview.jsx          # Dynamic HTML/CSS Social Ad Poster
│   │   │       ├── CampaignCard.jsx             # Campaign Card with Match Score
│   │   │       ├── DonationModal.jsx            # Razorpay Sandbox payment modal
│   │   │       ├── Footer.jsx                   # Trust & Transparency footer
│   │   │       ├── MatchScoreExplainer.jsx      # Explainable match factors
│   │   │       ├── Navbar.jsx                   # Nav with quick 1-click Demo Role Switcher
│   │   │       ├── NGOVerifiedBadge.jsx         # Statutory Darpan/12A/80G badge
│   │   │       ├── RiskScoreCard.jsx            # Explainable automated risk card
│   │   │       └── TransparencyScoreBadge.jsx   # Impact Transparency Score
│   │   ├── context\
│   │   │   └── AuthContext.jsx       # Authentication & role permissions state
│   │   ├── pages\
│   │   │   ├── admin\
│   │   │   │   └── AdminDashboard.jsx           # Statutory & evidence review console
│   │   │   ├── auth\
│   │   │   │   ├── LoginPage.jsx                # Login with 1-click demo accounts
│   │   │   │   └── RegisterPage.jsx             # Role-based onboarding
│   │   │   ├── donor\
│   │   │   │   ├── DonorDashboard.jsx           # Personalized match & donations
│   │   │   │   └── DonorImpactTracker.jsx       # Visual donation-to-impact journey
│   │   │   ├── ngo\
│   │   │   │   ├── CampaignStudio.jsx           # Grounded AI Campaign & Outreach Studio
│   │   │   │   ├── NGODashboard.jsx             # NGO metrics & campaign analytics
│   │   │   │   └── NGOMilestonesPage.jsx        # Proof-of-work evidence submission
│   │   │   └── public\
│   │   │       ├── AboutPage.jsx                # Principles & architectural mission
│   │   │       ├── CampaignDetailsPage.jsx      # Public campaign, milestones & evidence
│   │   │       ├── CampaignsPage.jsx            # Filterable campaign directory
│   │   │       ├── HowItWorksPage.jsx           # The 4-pillar trust architecture
│   │   │       ├── LandingPage.jsx              # Hero, stats, pillars & CTAs
│   │   │       └── NGOsPage.jsx                 # Verified NGOs directory
│   │   ├── utils\
│   │   │   └── helpers.js            # Currency, dates & explainable match engine
│   │   ├── App.jsx                   # App routes & role guards
│   │   ├── index.css                 # Tailwind typography & styles
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server\                           # Backend (Node.js, Express, Mongoose)
│   ├── config\
│   │   └── db.js                     # MongoDB connection with in-memory fallback
│   ├── controllers\
│   │   ├── adminController.js        # Approvals & statutory verification
│   │   ├── aiController.js           # Grounded AI studio & impact reports
│   │   ├── authController.js         # JWT auth & role authorization
│   │   ├── campaignController.js     # Campaigns & milestone management
│   │   ├── donationController.js     # Razorpay sandbox & impact journeys
│   │   ├── evidenceController.js     # Photo uploads & risk scoring
│   │   └── ngoController.js          # NGO profiles & metrics
│   ├── middleware\
│   │   ├── auth.js                   # JWT authentication & role-based access
│   │   └── upload.js                 # Multer photo/document storage
│   ├── models\
│   │   ├── AdminReview.js            # Immutable audit decision trail
│   │   ├── Campaign.js               # Campaign schema & parameters
│   │   ├── CampaignMilestone.js      # Milestone lifecycle state
│   │   ├── Donation.js               # Donation transactions & 80G receipts
│   │   ├── Evidence.js               # Uploaded proof, hashes, EXIF & risk
│   │   ├── NGO.js                    # NGO profile, Darpan ID, 12A, 80G
│   │   ├── Notification.js           # User notifications
│   │   └── User.js                   # User accounts & preferences
│   ├── services\
│   │   ├── aiService.js              # LLM integration & grounded fallback
│   │   ├── claimValidator.js         # Factual claim verification layer
│   │   ├── razorpayService.js        # Razorpay sandbox abstraction
│   │   └── riskAnalysisService.js    # Perceptual hash & EXIF risk engine
│   ├── utils\
│   │   └── seedData.js               # Demonstration dataset
│   ├── uploads\                      # Local storage for evidence files
│   ├── .env                          # Server configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                     # Express application bootstrap
│
├── test_scenario.js                  # Automated 22-step scenario verification script
└── README.md
```

---

## 2. Technologies Used

- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide React Icons, React Router v7, Canvas Confetti.
- **Backend**: Node.js v22, Express.js 4, Mongoose 8.
- **Database**: MongoDB (supports external MongoDB via `MONGODB_URI` + auto-boots embedded `mongodb-memory-server` for zero-friction local execution).
- **Security & Auth**: JSON Web Tokens (JWT), Bcrypt password hashing, role-based access control (`DONOR`, `NGO`, `ADMIN`).
- **Payments**: Razorpay Test/Sandbox abstraction with simulated orders and mock signature verification.
- **Image & Evidence Analysis**:
  - SHA-256 structural perceptual image hashing for duplicate detection.
  - EXIF metadata extraction (`exif-parser`) for camera hardware tags, capture timestamps, and software editing signatures.
  - Weighted explainable risk scoring.
- **AI Engine**: Grounded generative AI architecture supporting Google Gemini / OpenAI with built-in deterministic factual fallback and Claim Protection Layer.

---

## 3. Environment Variables Configuration

Create a `.env` file in `server/` (a ready-to-use `.env` and `.env.example` are included):

```env
PORT=5000
NODE_ENV=development

# Database: Leave empty to automatically use embedded in-memory MongoDB
# Or connect to your local or Atlas instance:
# MONGODB_URI=mongodb://localhost:27017/clearimpact

# JWT Secret
JWT_SECRET=clearimpact_super_secure_jwt_secret_key_demo_2026

# Razorpay Test Mode Credentials (Sandbox Mock)
RAZORPAY_KEY_ID=rzp_test_clearimpact_sandbox
RAZORPAY_KEY_SECRET=clearimpact_sandbox_secret_key_demo

# Optional: Add LLM API Key to connect live model
# GEMINI_API_KEY=your_gemini_api_key_here
# OPENAI_API_KEY=your_openai_api_key_here
```

---

## 4. How to Run Backend

1. Open PowerShell and navigate to `server`:
   ```powershell
   Set-Location D:\clearimpact\server
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm.cmd install
   ```
3. Start the backend:
   ```powershell
   node server.js
   ```
   *The backend starts on port 5000, connects to MongoDB (or starts the embedded instance), and automatically seeds all demonstration accounts, NGOs, and campaigns.*

---

## 5. How to Run Frontend

1. In a separate PowerShell window, navigate to `client`:
   ```powershell
   Set-Location D:\clearimpact\client
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm.cmd install
   ```
3. Start the Vite development server:
   ```powershell
   npm.cmd run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 6. Demo Credentials & 1-Click Role Switcher

For smooth demonstration, the login page (`/login`) and top navigation bar include instant **1-Click Demo Login buttons**:

| Role | Account Name | Email | Password | Access & Features |
|---|---|---|---|---|
| **NGO** | Vidya Foundation | `ngo@vidya.org` | `ngo123` | AI Campaign Studio, Milestone Submissions, Outreach Center |
| **DONOR** | Rahul Sharma | `donor@clearimpact.org` | `donor123` | Matching Recommendations, Sandbox Donations, Track My Impact |
| **ADMIN** | Dr. Anita Roy | `admin@clearimpact.org` | `admin123` | NGO Verification, Campaign Approvals, Evidence Risk Audit |

---

## 7. Main Features Implemented

1. **NGO Verification Queue**: Manual compliance review of NGO Darpan ID, PAN, 12A, and 80G tax certificates, granting the `✓ Verified NGO` badge.
2. **Grounded AI Campaign Studio**:
   - Generates Title, Short description, Detailed story, Donor appeal, Instagram caption, LinkedIn post, WhatsApp message, Email appeal, 30-sec video ad script, and Call to action.
   - **Claim Protection Layer**: Enforces the principle *"AI generates communication, not truth"*. Flags any discrepancy in beneficiary numbers, budgets, or locations with an explainable `⚠ Unsupported claim detected` banner.
3. **Dynamic Social Advertisement Poster Generator**:
   - Professional HTML/CSS social media campaign card with NGO logo, campaign imagery, target budget, beneficiaries, and ClearImpact verification seal.
   - Includes one-click **[Export Poster]** feature.
4. **Milestone-Based Escrow Fund Release**:
   - Funds are locked in escrow and move sequentially: `PENDING` → `FUNDED` → `EVIDENCE_SUBMITTED` → `UNDER_REVIEW` → `APPROVED` → `RELEASED`.
5. **Explainable Evidence Risk Engine**:
   - Evaluates uploaded photographic proof:
     - Duplicate photo check: `+50`
     - Tamper signal / editing software: `+40`
     - Old photo capture date: `+30`
     - Missing hardware metadata: `+10`
   - Transparently flags submissions with score $\ge 40$ as *"Requires Review"* without derogatory presumptions of fraud.
6. **Donor-Cause Explainable Matching Engine**:
   - Calculates personalized compatibility based on donor preferences: Cause match (+40), Location match (+20), Budget match (+20), Impact guarantee (+14).
7. **Razorpay Sandbox Integration**:
   - Realistic test payment modal supporting ₹500, ₹1000, ₹2000, and custom amounts, generating automated 80G digital tax receipts.
8. **Donor Impact Tracker**:
   - Visual step-by-step impact pipeline tracking each donation:
     `Donation → Campaign → Milestone → Evidence → Verification → Fund Release → Verified Impact Update`.

---

## 8. Verifying the End-to-End Demo Scenario

You can run the complete 22-step scenario automated test at any time by executing:
```powershell
Set-Location D:\clearimpact
node test_scenario.js
```
The test verifies:
1. NGO login
2. Education funding request generation in AI Studio
3. Factual claim validation check
4. Campaign submission
5. Admin login & approval
6. Donor login & campaign discovery
7. Razorpay sandbox donation
8. Milestone evidence upload & explainable risk scoring
9. Admin evidence audit & milestone fund release
10. Donor impact tracker verified journey verification.

---

## 9. Known Limitations & Future Improvements

- **Statutory Verification**: Prototype implements manual review by compliance administrators. Future production versions can integrate official Government of India NGO Darpan and Income Tax Department APIs.
- **Payment Gateway**: Runs in safe sandbox mode with simulated signature verification. In production, configure live Razorpay Webhooks and merchant keys.
- **Image Analysis**: Uses perceptual hashing and EXIF parser heuristics. Future roadmaps can incorporate edge computer-vision models for on-site geolocation geofencing.
