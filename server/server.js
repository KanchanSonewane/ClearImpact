require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./utils/seedData');
const { authenticate, authorize } = require('./middleware/auth');
const upload = require('./middleware/upload');

// Controllers
const authController = require('./controllers/authController');
const ngoController = require('./controllers/ngoController');
const campaignController = require('./controllers/campaignController');
const aiController = require('./controllers/aiController');
const donationController = require('./controllers/donationController');
const evidenceController = require('./controllers/evidenceController');
const adminController = require('./controllers/adminController');
const chatController = require('./controllers/chatController');
const optionalAuthenticate = require('./middleware/optionalAuth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ClearImpact',
    version: '1.0.0',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Seed demo data route
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Seed operation completed successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------
// 1. AUTH ROUTES
// ------------------------------------
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authenticate, authController.getMe);
app.put('/api/auth/preferences', authenticate, authController.updatePreferences);

// ------------------------------------
// 2. NGO ROUTES
// ------------------------------------
app.get('/api/ngos', ngoController.getAllNGOs);
app.get('/api/ngos/:id', ngoController.getNGOById);
app.get('/api/ngo/me', authenticate, authorize(['NGO', 'ADMIN']), ngoController.getMyNGO);
app.put('/api/ngo/me', authenticate, authorize(['NGO', 'ADMIN']), ngoController.updateMyNGO);
app.get('/api/ngo/stats', authenticate, authorize(['NGO', 'ADMIN']), ngoController.getNGODashboardStats);

// ------------------------------------
// 3. CAMPAIGN ROUTES
// ------------------------------------
app.get('/api/campaigns', campaignController.getAllCampaigns);
app.get('/api/campaigns/ngo/my', authenticate, authorize(['NGO', 'ADMIN']), campaignController.getMyCampaigns);
app.get('/api/campaigns/:id', campaignController.getCampaignById);
app.post('/api/campaigns', authenticate, authorize(['NGO', 'ADMIN']), campaignController.createCampaign);
app.put('/api/campaigns/:id', authenticate, authorize(['NGO', 'ADMIN']), campaignController.updateCampaign);
app.delete('/api/campaigns/:id', authenticate, authorize(['NGO', 'ADMIN']), campaignController.deleteCampaign);
app.post('/api/campaigns/:id/report', campaignController.reportCampaign);

// ------------------------------------
// 4. AI STUDIO ROUTES
// ------------------------------------
app.post('/api/ai/generate-campaign', authenticate, authorize(['NGO', 'ADMIN']), aiController.generateCampaign);
app.post('/api/ai/validate-claims', authenticate, aiController.validateClaims);
app.post('/api/ai/generate-impact-report/:milestoneId', authenticate, aiController.generateImpactReport);
app.post('/api/chat/message', optionalAuthenticate, chatController.sendMessage);

// ------------------------------------
// 5. DONATION & PAYMENT ROUTES
// ------------------------------------
app.post('/api/donations/create', authenticate, donationController.createDonationOrder);
app.post('/api/donations/verify', authenticate, donationController.verifyDonation);
app.get('/api/donations/my', authenticate, donationController.getMyDonations);
app.get('/api/donations/impact/:id', authenticate, donationController.getDonationImpactTimeline);

// ------------------------------------
// 6. EVIDENCE & RISK ENGINE ROUTES
// ------------------------------------
app.post(
  '/api/evidence/upload',
  authenticate,
  authorize(['NGO', 'ADMIN']),
  upload.fields([
    { name: 'afterPhoto', maxCount: 1 },
    { name: 'beforePhoto', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  evidenceController.uploadEvidence
);
app.get('/api/evidence/:id', evidenceController.getEvidenceById);
app.get('/api/evidence/campaign/:campaignId', evidenceController.getCampaignEvidence);

// ------------------------------------
// 7. ADMIN ROUTES
// ------------------------------------
app.get('/api/admin/overview', authenticate, authorize(['ADMIN']), adminController.getAdminOverview);
app.get('/api/admin/ngos/pending', authenticate, authorize(['ADMIN']), adminController.getPendingNGOs);
app.post('/api/admin/ngos/:id/verify', authenticate, authorize(['ADMIN']), adminController.verifyNGO);
app.get('/api/admin/campaigns/pending', authenticate, authorize(['ADMIN']), adminController.getPendingCampaigns);
app.post('/api/admin/campaigns/:id/review', authenticate, authorize(['ADMIN']), adminController.reviewCampaign);
app.get('/api/admin/evidence/pending', authenticate, authorize(['ADMIN']), adminController.getPendingEvidence);
app.post('/api/admin/evidence/:id/review', authenticate, authorize(['ADMIN']), adminController.reviewEvidence);

// ------------------------------------
// 8. SERVE FRONTEND (FULL-STACK PRODUCTION & DEMO SHARING)
// ------------------------------------
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start Server
async function startServer() {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` CLEARIMPACT BACKEND SERVER ONLINE ON PORT ${PORT}`);
    console.log(` API URL: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

startServer();
