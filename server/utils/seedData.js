const User = require('../models/User');
const NGO = require('../models/NGO');
const Campaign = require('../models/Campaign');
const CampaignMilestone = require('../models/CampaignMilestone');
const Evidence = require('../models/Evidence');
const Donation = require('../models/Donation');
const AdminReview = require('../models/AdminReview');
const Notification = require('../models/Notification');

async function seedDatabase() {
  try {
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log('[Seed] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seed] Populating realistic ClearImpact demonstration data...');

    // 1. Create Users
    const adminUser = new User({
      name: 'Dr. Anita Roy (Admin Compliance)',
      email: 'admin@clearimpact.org',
      password: 'admin123',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });
    await adminUser.save();

    const ngoUser1 = new User({
      name: 'Vidya Education Mission',
      email: 'ngo@vidya.org',
      password: 'ngo123',
      role: 'NGO',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    });
    await ngoUser1.save();

    const ngoUser2 = new User({
      name: 'Aarogya Seva Trust',
      email: 'ngo@aarogya.org',
      password: 'ngo123',
      role: 'NGO',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    });
    await ngoUser2.save();

    const ngoUser3 = new User({
      name: 'GreenFuture Foundation',
      email: 'ngo@greenfuture.org',
      password: 'ngo123',
      role: 'NGO',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });
    await ngoUser3.save();

    const donorUser = new User({
      name: 'Rahul Sharma (Verified Donor)',
      email: 'donor@clearimpact.org',
      password: 'donor123',
      role: 'DONOR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      preferences: {
        causes: ['Education', 'Healthcare', 'Environment'],
        preferredLocations: ['Maharashtra', 'Nagpur', 'Pune'],
        minBudget: 500,
        maxBudget: 10000,
        impactPreference: 'Milestone-based fund release with verified photo proof',
      }
    });
    await donorUser.save();

    // 2. Create 3 Verified NGOs
    const vidyaNGO = new NGO({
      userId: ngoUser1._id,
      orgName: 'Vidya Foundation',
      darpanId: 'MH/2021/0148291',
      registrationId: 'MAH/BOM/884/2012',
      pan: 'AAATV4821E',
      status12A: 'YES',
      status80G: 'YES',
      address: {
        street: '42, Civil Lines',
        city: 'Nagpur',
        state: 'Maharashtra',
        pincode: '440001',
      },
      contact: {
        phone: '+91 712 2568910',
        email: 'contact@vidyafoundation.org',
        website: 'https://vidyafoundation.org',
        social: '@vidya_foundation_in',
      },
      description: 'Dedicated to empowering underprivileged students across eastern Maharashtra through verified learning kits, STEM workshops, and classroom infrastructure.',
      mission: 'Every child deserves unbroken access to quality education backed by radical donor transparency.',
      logoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80',
      verificationStatus: 'VERIFIED',
      verificationType: 'Manual verification in prototype (Future: Official NGO Darpan API integration)',
      verificationNotes: 'All 80G, 12A, and Darpan ID documents verified manually against certified state society registrar records.',
      verifiedAt: new Date(Date.now() - 30 * 86400000),
      transparencyScore: 94,
      isDemo: true,
    });
    await vidyaNGO.save();

    const aarogyaNGO = new NGO({
      userId: ngoUser2._id,
      orgName: 'Aarogya Seva Trust',
      darpanId: 'MH/2019/0091823',
      registrationId: 'MAH/PUN/412/2014',
      pan: 'AACTA9012F',
      status12A: 'YES',
      status80G: 'YES',
      address: {
        street: '15, Karve Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411004',
      },
      contact: {
        phone: '+91 20 25439812',
        email: 'info@aarogyaseva.org',
        website: 'https://aarogyaseva.org',
        social: '@aarogyasevatrust',
      },
      description: 'Rural healthcare initiative conducting mobile diagnostic camps, emergency medical supplies, and maternal health monitoring.',
      mission: 'Zero preventable deaths in remote agrarian belts through transparent, auditable healthcare logistics.',
      logoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80',
      verificationStatus: 'VERIFIED',
      verificationType: 'Manual verification in prototype',
      verificationNotes: 'Audited balance sheets, FCRA clearance, and medical advisory council verified.',
      verifiedAt: new Date(Date.now() - 45 * 86400000),
      transparencyScore: 91,
      isDemo: true,
    });
    await aarogyaNGO.save();

    const greenNGO = new NGO({
      userId: ngoUser3._id,
      orgName: 'GreenFuture Foundation',
      darpanId: 'KA/2020/0283910',
      registrationId: 'KAR/BLR/672/2018',
      pan: 'AABTG7712M',
      status12A: 'YES',
      status80G: 'YES',
      address: {
        street: '88, Indiranagar 100ft Rd',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
      },
      contact: {
        phone: '+91 80 41209843',
        email: 'hello@greenfuture.eco',
        website: 'https://greenfuture.eco',
        social: '@greenfuture_eco',
      },
      description: 'Restoring degraded watershed areas, planting native agroforests with rural farmers, and installing community rainwater harvesting.',
      mission: 'Measurable ecological regeneration with satellite and geotagged on-ground verification.',
      logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
      verificationStatus: 'VERIFIED',
      verificationType: 'Manual verification in prototype',
      verificationNotes: 'Field forestry audit reports and bank authorization reviewed.',
      verifiedAt: new Date(Date.now() - 60 * 86400000),
      transparencyScore: 89,
      isDemo: true,
    });
    await greenNGO.save();

    // 3. Create 5 Realistic Campaigns
    // Campaign 1: Education Kits in Nagpur (Vidya Foundation) - PRIMARY DEMO CAMPAIGN
    const c1 = new Campaign({
      ngoId: vidyaNGO._id,
      title: 'Equip 500 Underprivileged Students with Education Kits',
      causeCategory: 'Education',
      location: 'Nagpur, Maharashtra',
      targetAmount: 200000,
      raisedAmount: 145000,
      beneficiariesCount: 500,
      deadline: new Date(Date.now() + 45 * 86400000),
      problem: 'Students in government-aided schools in rural Nagpur struggle without fundamental stationery, textbooks, and mathematical instruments, causing high drop-out rates in secondary grades.',
      solution: 'Procure, assemble, and distribute 500 standardized learning kits (notebooks, backpacks, geometry kits, reference guides) directly to verified students.',
      expectedImpact: '500 students in 6 rural clusters will attend classes equipped with necessary supplies, boosting daily attendance by over 30%.',
      status: 'ACTIVE',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      transparencyScore: 95,
      isDemo: true,
      aiGeneratedContent: {
        shortDescription: 'ClearImpact campaign by Vidya Foundation: Raising ₹2,00,000 to provide 500 students in Nagpur with complete educational kits.',
        story: 'In rural pockets around Nagpur, children start each term facing severe shortage of notebooks and basic tools. Vidya Foundation breaks this barrier through verifiable, milestone-based educational distribution.',
        donorAppeal: 'Every rupee you contribute is safeguarded by ClearImpact milestone escrow. Funds are released strictly upon verified delivery evidence.',
        hasReviewWarning: false,
        reviewedByNGO: true,
      }
    });
    await c1.save();

    // Milestones for Campaign 1
    const m1_1 = new CampaignMilestone({
      campaignId: c1._id,
      order: 1,
      title: 'Bulk Kit Procurement & Wholesale Vendor Verification',
      description: 'Procurement of 500 heavy-duty backpacks, 2,500 notebooks, and 500 geometry sets at subsidized wholesale rates.',
      targetAmount: 75000,
      releasedAmount: 75000,
      evidenceRequirements: 'Itemized vendor GST invoices, delivery challans, and warehouse inspection photos.',
      status: 'RELEASED',
      releasedAt: new Date(Date.now() - 10 * 86400000),
      completionDate: new Date(Date.now() - 11 * 86400000),
    });
    await m1_1.save();

    const m1_2 = new CampaignMilestone({
      campaignId: c1._id,
      order: 2,
      title: 'School Distribution & Beneficiary Verification',
      description: 'Direct distribution across 3 rural schools in Kamptee and Hingna blocks.',
      targetAmount: 75000,
      releasedAmount: 0,
      evidenceRequirements: 'Timestamped distribution photos, headmaster verification certificates, student signature log.',
      status: 'FUNDED',
    });
    await m1_2.save();

    const m1_3 = new CampaignMilestone({
      campaignId: c1._id,
      order: 3,
      title: 'Academic Progress Follow-up & Final Audit',
      description: 'Conduct mid-term academic monitoring and audited financial utilization report.',
      targetAmount: 50000,
      releasedAmount: 0,
      evidenceRequirements: 'Detailed attendance tracking report and CA certificate of fund deployment.',
      status: 'PENDING',
    });
    await m1_3.save();

    // Verified Evidence for Milestone 1 of Campaign 1
    const evidence1 = new Evidence({
      campaignId: c1._id,
      milestoneId: m1_1._id,
      ngoId: vidyaNGO._id,
      title: 'Warehouse Kit Procurement & Assembly Audit',
      reportText: 'Completed procurement of 500 educational kit sets from registered vendor Navneet Stationers (GSTIN: 27AABCV1234D1Z8). Goods delivered to Nagpur transit warehouse, verified by Vidya field coordinators.',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
      beneficiariesReached: 500,
      locationVerified: 'Nagpur Warehouse Hub',
      imageHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      exifData: {
        hasExif: true,
        make: 'Sony',
        model: 'ILCE-7M3',
        software: 'Firmware 4.01',
        dateTimeOriginal: new Date(Date.now() - 12 * 86400000),
      },
      riskScore: 10,
      riskLevel: 'LOW',
      riskReasons: [
        { code: 'DUPLICATE_CHECK', title: 'Original Image', description: 'No matching duplicate found in the ClearImpact evidence repository.', weight: 0, passed: true },
        { code: 'TAMPER_CHECK', title: 'No Tamper Signal', description: 'No editing software signatures detected in file container.', weight: 0, passed: true },
        { code: 'PHOTO_DATE_CHECK', title: 'Fresh Capture Timestamp', description: 'Photo captured recently, consistent with campaign timeline.', weight: 0, passed: true },
        { code: 'METADATA_PRESENT', title: 'Hardware Metadata Intact', description: 'Captured via Sony ILCE-7M3.', weight: 0, passed: true },
      ],
      adminStatus: 'APPROVED',
      adminNotes: 'Invoices verified against GST portal. Warehouse count matches milestone target.',
      reviewedBy: adminUser._id,
      reviewedAt: new Date(Date.now() - 10 * 86400000),
      aiImpactSummary: {
        text: 'Your contribution supported the Education Kit Drive. The first milestone was completed and the submitted evidence was reviewed by ClearImpact. Total milestone funds of ₹75,000 were released for 500 verified students in Nagpur, Maharashtra.',
        isAiGenerated: true,
        groundedSources: ['Campaign: Equip 500 Underprivileged Students with Education Kits', 'Milestone 1: Bulk Kit Procurement'],
      }
    });
    await evidence1.save();

    // Campaign 2: Mobile Health Clinic for Rural Pune (Aarogya Seva Trust)
    const c2 = new Campaign({
      ngoId: aarogyaNGO._id,
      title: 'Mobile Health Clinics for 1,200 Tribal Villagers in Pune',
      causeCategory: 'Healthcare',
      location: 'Pune, Maharashtra',
      targetAmount: 350000,
      raisedAmount: 210000,
      beneficiariesCount: 1200,
      deadline: new Date(Date.now() + 60 * 86400000),
      problem: 'Tribal hamlets in Velhe taluka have zero primary healthcare centers within a 25km radius, leaving chronic ailments and pregnancy screenings untreated.',
      solution: 'Deploy 6 fully equipped mobile health clinic visits staffed by MBBS doctors, nurses, and point-of-care diagnostic tools.',
      expectedImpact: '1,200 villagers screened, diagnosed, and supplied with essential medications over 60 days.',
      status: 'ACTIVE',
      coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      transparencyScore: 92,
      isDemo: true,
    });
    await c2.save();

    const m2_1 = new CampaignMilestone({
      campaignId: c2._id,
      order: 1,
      title: 'Mobile Van Diagnostic Kit & Medicine Stocking',
      targetAmount: 120000,
      releasedAmount: 120000,
      evidenceRequirements: 'Pharmacy purchase vouchers, batch release certificates, calibrated diagnostic tools inventory.',
      status: 'RELEASED',
      releasedAt: new Date(Date.now() - 15 * 86400000),
    });
    await m2_1.save();

    const m2_2 = new CampaignMilestone({
      campaignId: c2._id,
      order: 2,
      title: 'First Wave: 3 Mobile Camps in Velhe Hamlets',
      targetAmount: 130000,
      releasedAmount: 0,
      evidenceRequirements: 'Patient consultation registers (redacted), doctor logs, camp geotagged photos.',
      status: 'FUNDED',
    });
    await m2_2.save();

    const m2_3 = new CampaignMilestone({
      campaignId: c2._id,
      order: 3,
      title: 'Follow-up Camps & Medicine Refills',
      targetAmount: 100000,
      releasedAmount: 0,
      evidenceRequirements: 'Secondary screening records and patient recovery impact assessment.',
      status: 'PENDING',
    });
    await m2_3.save();

    // Campaign 3: Community Rainwater Harvesting (GreenFuture Foundation)
    const c3 = new Campaign({
      ngoId: greenNGO._id,
      title: 'Install Rainwater Harvesting for 8 Drought-Prone Villages',
      causeCategory: 'Environment',
      location: 'Kolar, Karnataka',
      targetAmount: 400000,
      raisedAmount: 380000,
      beneficiariesCount: 2400,
      deadline: new Date(Date.now() + 30 * 86400000),
      problem: 'Groundwater depletion in Kolar district has dried out agricultural wells, leaving village communities dependent on paid water tankers.',
      solution: 'Construct 8 gravity-fed percolation pits and recharge recharge shafts connected to community rooftops.',
      expectedImpact: 'Recharge 3.5 million liters of groundwater annually, providing clean domestic water for 2,400 residents.',
      status: 'ACTIVE',
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      transparencyScore: 90,
      isDemo: true,
    });
    await c3.save();

    const m3_1 = new CampaignMilestone({
      campaignId: c3._id,
      order: 1,
      title: 'Civil Excavation & Filter Bed Construction',
      targetAmount: 180000,
      releasedAmount: 180000,
      evidenceRequirements: 'Excavation dimension measurements, sand/gravel filter delivery receipts, drone/aerial photos.',
      status: 'RELEASED',
    });
    await m3_1.save();

    const m3_2 = new CampaignMilestone({
      campaignId: c3._id,
      order: 2,
      title: 'Piping, Desilting Chambers, and Water Meter Installation',
      targetAmount: 140000,
      releasedAmount: 0,
      evidenceRequirements: 'Plumbing completion photos, Panchayat handover letters, water flow test readings.',
      status: 'EVIDENCE_SUBMITTED', // Pending review to demonstrate admin approval queue
    });
    await m3_2.save();

    // Create a FLAGGED sample evidence to demonstrate the explainable risk engine in Admin dashboard!
    const flaggedEvidence = new Evidence({
      campaignId: c3._id,
      milestoneId: m3_2._id,
      ngoId: greenNGO._id,
      title: 'Water Chamber Completion Photo (Prototype Sample Flag)',
      reportText: 'Plumbing and desilting chambers constructed. Tank test conducted.',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80',
      beneficiariesReached: 2400,
      locationVerified: 'Kolar Village Site',
      imageHash: 'dup_demo_hash_9876543210',
      exifData: {
        hasExif: true,
        software: 'Adobe Photoshop 2024 (Macintosh)',
        dateTimeOriginal: new Date('2022-04-15'), // Old photo date!
      },
      riskScore: 70, // 40 (tamper) + 30 (old date) = 70
      riskLevel: 'FLAGGED',
      riskReasons: [
        { code: 'TAMPER_SIGNAL', title: 'Editing/Tamper Signal Detected', description: 'EXIF software tag indicates post-processing (Adobe Photoshop 2024). May require verification of raw unedited assets.', weight: 40, passed: false },
        { code: 'OLD_PHOTO_DATE', title: 'Historic Capture Date', description: 'Photo timestamp predates campaign launch by 740 days.', weight: 30, passed: false },
        { code: 'DUPLICATE_CHECK', title: 'Original Image', description: 'No matching duplicate found in the ClearImpact evidence repository.', weight: 0, passed: true },
        { code: 'METADATA_PRESENT', title: 'Hardware Metadata Intact', description: 'EXIF tags readable.', weight: 0, passed: true },
      ],
      adminStatus: 'PENDING',
      adminNotes: '',
    });
    await flaggedEvidence.save();

    // Campaign 4: Nutrition & Mid-Day Meals (Vidya Foundation)
    const c4 = new Campaign({
      ngoId: vidyaNGO._id,
      title: 'Nutritious Breakfast for 300 Slum Children in East Nagpur',
      causeCategory: 'Hunger Relief',
      location: 'Nagpur, Maharashtra',
      targetAmount: 150000,
      raisedAmount: 150000,
      beneficiariesCount: 300,
      deadline: new Date(Date.now() + 15 * 86400000),
      problem: 'Severe early-morning hunger impairs concentration and cognitive development among daily-wage earners children.',
      solution: 'Provide fortified millet-banana porridge and boiled eggs 6 mornings a week for 90 days.',
      expectedImpact: '300 children receive 450 daily calories of balanced nutrition, eliminating early morning absenteeism.',
      status: 'ACTIVE',
      coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      transparencyScore: 93,
      isDemo: true,
    });
    await c4.save();

    const m4_1 = new CampaignMilestone({
      campaignId: c4._id,
      order: 1,
      title: 'Kitchen Setup & Dry Ration Procurement',
      targetAmount: 60000,
      releasedAmount: 60000,
      evidenceRequirements: 'FSSAI hygienic kitchen compliance certificate, grain purchase receipts.',
      status: 'RELEASED',
    });
    await m4_1.save();

    // Campaign 5: Pending approval campaign (To demonstrate Admin Campaign Approval Queue!)
    const c5 = new Campaign({
      ngoId: aarogyaNGO._id,
      title: 'Solar Power for Remote Primary Healthcare Center',
      causeCategory: 'Healthcare',
      location: 'Bhor, Maharashtra',
      targetAmount: 250000,
      raisedAmount: 0,
      beneficiariesCount: 800,
      deadline: new Date(Date.now() + 75 * 86400000),
      problem: 'Frequent 10-hour grid outages spoil cold-chain vaccine storage and leave labor rooms in total darkness.',
      solution: 'Install a 5kVA rooftop hybrid solar system with tubular lithium battery backup for critical refrigerators.',
      expectedImpact: 'Unbroken 24/7 refrigeration for 3,000 vaccine vials and uninterrupted emergency maternity delivery lighting.',
      status: 'PENDING_APPROVAL',
      coverImage: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1200&q=80',
      transparencyScore: 90,
      isDemo: true,
    });
    await c5.save();

    const m5_1 = new CampaignMilestone({
      campaignId: c5._id,
      order: 1,
      title: 'Solar Panels & Inverter Hardware Procurement',
      targetAmount: 150000,
      evidenceRequirements: 'MNRE tier-1 certified solar panel dispatch bill and manufacturer warranty cards.',
      status: 'PENDING',
    });
    await m5_1.save();

    // 4. Sample Donations for Rahul Sharma (Verified Donor)
    const donation1 = new Donation({
      donorId: donorUser._id,
      campaignId: c1._id,
      amount: 2000,
      currency: 'INR',
      paymentGateway: 'RAZORPAY_SANDBOX',
      orderId: 'order_test_demo_98124',
      paymentId: 'pay_test_demo_55102',
      status: 'SUCCESS',
      donorName: donorUser.name,
      donorEmail: donorUser.email,
      createdAt: new Date(Date.now() - 15 * 86400000),
    });
    await donation1.save();

    const donation2 = new Donation({
      donorId: donorUser._id,
      campaignId: c2._id,
      amount: 1500,
      currency: 'INR',
      paymentGateway: 'RAZORPAY_SANDBOX',
      orderId: 'order_test_demo_88231',
      paymentId: 'pay_test_demo_44190',
      status: 'SUCCESS',
      donorName: donorUser.name,
      donorEmail: donorUser.email,
      createdAt: new Date(Date.now() - 25 * 86400000),
    });
    await donation2.save();

    console.log('[Seed] Demonstration data successfully loaded!');
    console.log('   Admin: admin@clearimpact.org / admin123');
    console.log('   NGO:   ngo@vidya.org / ngo123');
    console.log('   Donor: donor@clearimpact.org / donor123');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
}

module.exports = { seedDatabase };
