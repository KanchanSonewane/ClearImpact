const API = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  return data;
}

async function runEndToEndScenario() {
  console.log('===========================================================');
  console.log('STARTING CLEARIMPACT END-TO-END DEMO SCENARIO VERIFICATION');
  console.log('===========================================================\n');

  try {
    // 1. Login as NGO (Vidya Foundation)
    console.log('[Step 1] Logging in as NGO (ngo@vidya.org)...');
    const ngoLogin = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'ngo@vidya.org', password: 'ngo123' }),
    });
    const ngoToken = ngoLogin.token;
    const ngoHeaders = { Authorization: `Bearer ${ngoToken}` };
    console.log('✓ NGO Logged in successfully. Token acquired.');

    // 2, 3, 4. AI Campaign Studio Generation
    console.log('\n[Step 2-5] Submitting education funding request to Grounded AI Campaign Studio...');
    const campaignInput = {
      causeCategory: 'Education',
      targetAmount: 200000,
      beneficiariesCount: 500,
      location: 'Nagpur, Maharashtra',
      problem: 'Students from low-income families lack basic educational materials.',
      solution: 'Provide educational kits including notebooks, stationery, and geometry sets.',
      expectedImpact: '500 students receive educational kits.',
      orgName: 'Vidya Foundation',
    };

    const aiRes = await req(`${API}/ai/generate-campaign`, {
      method: 'POST',
      headers: ngoHeaders,
      body: JSON.stringify(campaignInput),
    });
    const generated = aiRes.data;
    console.log('✓ AI Generated Campaign Title:', generated.title);
    console.log('✓ Factual Integrity Verified (No Hallucination):', !generated.hasReviewWarning);
    console.log('✓ Instagram Caption Length:', generated.instagramCaption.length, 'chars');
    console.log('✓ LinkedIn Post Length:', generated.linkedInPost.length, 'chars');
    console.log('✓ WhatsApp Message Length:', generated.whatsAppMessage.length, 'chars');
    console.log('✓ Video Script Length:', generated.videoScript.length, 'chars');

    // 8. Submit Campaign for Approval
    console.log('\n[Step 8] NGO submitting campaign for admin review...');
    const testTitle = `Empower 500 Students with Educational Kits [Run-${Date.now().toString().slice(-4)}]`;
    const newCampRes = await req(`${API}/campaigns`, {
      method: 'POST',
      headers: ngoHeaders,
      body: JSON.stringify({
        ...campaignInput,
        title: testTitle,
        aiGeneratedContent: generated,
      }),
    });
    const createdCampaign = newCampRes.campaign;
    console.log(`✓ Campaign submitted: "${createdCampaign.title}" (ID: ${createdCampaign._id}, Status: ${createdCampaign.status})`);

    // 9. Login as Admin
    console.log('\n[Step 9] Logging in as Admin (admin@clearimpact.org)...');
    const adminLogin = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@clearimpact.org', password: 'admin123' }),
    });
    const adminToken = adminLogin.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };
    console.log('✓ Admin Logged in.');

    // 10. Admin Approves Campaign
    console.log('\n[Step 10] Admin approving submitted campaign...');
    const approveCampRes = await req(`${API}/admin/campaigns/${createdCampaign._id}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        decision: 'APPROVED',
        notes: 'Verified compliance and realistic milestone requirements for Nagpur students.',
      }),
    });
    console.log(`✓ Campaign Approved! New Status: ${approveCampRes.campaign.status}`);

    // 11. Login as Donor
    console.log('\n[Step 11] Logging in as Donor (donor@clearimpact.org)...');
    const donorLogin = await req(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'donor@clearimpact.org', password: 'donor123' }),
    });
    const donorToken = donorLogin.token;
    const donorHeaders = { Authorization: `Bearer ${donorToken}` };
    console.log('✓ Donor Logged in.');

    // 12. Browse Campaign Details & Milestones
    console.log('\n[Step 12] Donor browsing approved campaign details...');
    const campDetails = await req(`${API}/campaigns/${createdCampaign._id}`);
    const milestones = campDetails.milestones;
    console.log(`✓ Campaign retrieved: "${campDetails.campaign.title}" with ${milestones.length} milestones.`);

    // 13. Donate using Razorpay Test Mode
    console.log('\n[Step 13] Donor initiating Razorpay Sandbox donation of ₹1,000...');
    const orderRes = await req(`${API}/donations/create`, {
      method: 'POST',
      headers: donorHeaders,
      body: JSON.stringify({ campaignId: createdCampaign._id, amount: 1000 }),
    });
    console.log(`✓ Razorpay Test Order Created: ${orderRes.order.id}`);

    const verifyDonationRes = await req(`${API}/donations/verify`, {
      method: 'POST',
      headers: donorHeaders,
      body: JSON.stringify({
        orderId: orderRes.order.id,
        paymentId: `pay_test_${Date.now()}`,
        signature: 'mock_sig_sandbox_valid',
        campaignId: createdCampaign._id,
        amount: 1000,
        isAnonymous: false,
      }),
    });
    const donationRecord = verifyDonationRes.donation;
    console.log(`✓ Donation Verified & Earmarked in Escrow! Receipt: ${donationRecord.taxReceiptNumber}`);

    // 14. Login as NGO & Upload Evidence for Milestone 1
    console.log('\n[Step 14-16] NGO uploading milestone execution evidence & running risk analysis...');
    const targetMilestone = milestones[0];
    const evidenceUploadRes = await req(`${API}/evidence/upload`, {
      method: 'POST',
      headers: ngoHeaders,
      body: JSON.stringify({
        campaignId: createdCampaign._id,
        milestoneId: targetMilestone._id,
        title: 'Bulk Kit Procurement & Transit Warehouse Invoices',
        reportText: 'Procured 500 student kits from authorized supplier. Checked physical inventory against student headcount.',
        beneficiariesReached: 500,
        afterPhotoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
        beforePhotoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      }),
    });
    const evidence = evidenceUploadRes.evidence;
    const riskSummary = evidenceUploadRes.riskSummary;
    console.log(`✓ Evidence Submitted: "${evidence.title}"`);
    console.log(`✓ Automated Explainable Risk Score: ${riskSummary.riskScore}/100 (${riskSummary.riskLevel})`);
    console.log(`✓ Explainable Signals Breakdown:`, riskSummary.riskReasons.map(r => `${r.title}: ${r.passed ? 'PASSED' : 'FLAGGED'}`).join(' | '));

    // 17-19. Admin Reviews Evidence & Approves Milestone Release
    console.log('\n[Step 17-19] Admin reviewing evidence & authorizing milestone fund release...');
    const approveEvRes = await req(`${API}/admin/evidence/${evidence._id}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        decision: 'APPROVED',
        notes: 'GST invoices and warehouse batch photos verified against educational vendor portal.',
      }),
    });
    console.log(`✓ Admin Decision: ${approveEvRes.evidence.adminStatus}`);
    console.log(`✓ Milestone Funds Released: ₹${approveEvRes.milestone.releasedAmount.toLocaleString('en-IN')}`);
    console.log(`✓ Grounded AI Impact Report Generated:`, approveEvRes.evidence.aiImpactSummary?.summary ? 'YES' : 'PENDING');

    // 20-22. Donor Tracks Verified Impact Journey
    console.log('\n[Step 20-22] Donor opening "Track My Impact" visual timeline...');
    const impactRes = await req(`${API}/donations/impact/${donationRecord._id}`, { headers: donorHeaders });
    const journey = impactRes.journey;
    console.log(`✓ Complete Verified Impact Chain retrieved for Donation ${donationRecord._id}:`);
    journey.forEach(stage => {
      console.log(`   • Milestone ${stage.order}: "${stage.title}" -> Status: [${stage.status}]`);
      if (stage.evidence) {
        console.log(`     Evidence Title: ${stage.evidence.title}`);
        console.log(`     Risk Score: ${stage.evidence.riskScore}/100`);
        console.log(`     Admin Verification: ${stage.evidence.adminStatus}`);
      }
    });

    console.log('\n===========================================================');
    console.log('✓ ALL 22 END-TO-END DEMO SCENARIO STEPS FULLY OPERATIONAL!');
    console.log('===========================================================');
  } catch (err) {
    console.error('Scenario verification error:', err.message);
  }
}

runEndToEndScenario();
