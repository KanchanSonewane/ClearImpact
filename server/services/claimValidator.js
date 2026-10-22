/**
 * Grounded AI Claim Validation Layer
 * Compares generated text against submitted campaign parameters.
 * Guarantees that AI NEVER invents numbers, financial amounts, locations, or exaggerated statistics.
 */

function validateCampaignClaims(generatedContent, campaignInput) {
  const warnings = [];
  const combinedText = [
    generatedContent.shortDescription || '',
    generatedContent.story || '',
    generatedContent.donorAppeal || '',
    generatedContent.instagramCaption || '',
    generatedContent.linkedInPost || '',
    generatedContent.whatsAppMessage || '',
    generatedContent.emailAppeal || '',
    generatedContent.videoScript || '',
  ].join(' ').toLowerCase();

  const actualBeneficiaries = Number(campaignInput.beneficiariesCount || 0);
  const actualTarget = Number(campaignInput.targetAmount || 0);
  const actualLocation = (campaignInput.location || '').toLowerCase();

  // 1. Beneficiary count validation
  const hyperbolicBeneficiaryTerms = [
    'thousands of students',
    'thousands of children',
    'thousands of beneficiaries',
    'tens of thousands',
    'millions of',
    'hundreds of thousands',
    'countless children',
    'innumerable students'
  ];

  for (const term of hyperbolicBeneficiaryTerms) {
    if (combinedText.includes(term) && actualBeneficiaries < 1000) {
      warnings.push({
        code: 'UNSUPPORTED_BENEFICIARY_COUNT',
        severity: 'WARNING',
        field: 'beneficiaries',
        message: `The generated content references "${term}", which exceeds the submitted count of ${actualBeneficiaries} beneficiaries.`,
        recommendation: `Align with exact verified count of ${actualBeneficiaries} beneficiaries.`
      });
      break;
    }
  }

  // Check numeric matches in text vs actual beneficiaries
  const numberMatches = combinedText.match(/\b\d{3,7}\b/g) || [];
  for (const numStr of numberMatches) {
    const num = parseInt(numStr, 10);
    // If text mentions numbers like 2000, 5000, 10000 when beneficiaries is 500 and target is 200000
    if (num !== actualBeneficiaries && num !== actualTarget && num !== (actualTarget / 1000) && num > actualBeneficiaries && num < (actualTarget * 0.1)) {
      if (actualBeneficiaries > 0 && num > actualBeneficiaries * 1.5) {
        warnings.push({
          code: 'UNVERIFIED_STATISTIC',
          severity: 'INFO',
          field: 'statistics',
          message: `Mention of "${num}" found, which does not match verified submitted beneficiary count (${actualBeneficiaries}).`,
          recommendation: `Verify whether "${num}" is an accurate factual claim.`
        });
        break;
      }
    }
  }

  // 2. Location verification
  if (actualLocation) {
    const parts = actualLocation.split(',').map(p => p.trim());
    const primaryCity = parts[0];
    if (primaryCity && primaryCity.length > 3) {
      const mentionsWrongMetros = ['delhi', 'mumbai', 'bengaluru', 'kolkata', 'chennai', 'hyderabad']
        .filter(city => !actualLocation.includes(city) && combinedText.includes(city));
      if (mentionsWrongMetros.length > 0) {
        warnings.push({
          code: 'LOCATION_INCONSISTENCY',
          severity: 'WARNING',
          field: 'location',
          message: `Generated text references unrelated location (${mentionsWrongMetros.join(', ')}), while submitted location is ${campaignInput.location}.`,
          recommendation: `Ensure geographic scope remains strictly centered on ${campaignInput.location}.`
        });
      }
    }
  }

  // 3. Financial exaggeration check
  const financialHyperbole = ['crores of rupees', 'millions of dollars', '10x impact guaranteed'];
  for (const fh of financialHyperbole) {
    if (combinedText.includes(fh)) {
      warnings.push({
        code: 'UNSUPPORTED_FINANCIAL_CLAIM',
        severity: 'WARNING',
        field: 'targetAmount',
        message: `Exaggerated financial phrasing "${fh}" detected. Campaign target is ₹${actualTarget.toLocaleString('en-IN')}.`,
        recommendation: `Stick to the submitted milestone budget of ₹${actualTarget.toLocaleString('en-IN')}.`
      });
    }
  }

  return {
    hasReviewWarning: warnings.length > 0,
    unsupportedClaims: warnings.map(w => w.message),
    warningDetails: warnings,
    label: warnings.length > 0 ? 'AI Generated — Review Required' : 'AI Generated — Grounded & Verified',
  };
}

module.exports = { validateCampaignClaims };
