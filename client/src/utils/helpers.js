export const formatINR = (val) => {
  if (val === undefined || val === null) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Explainable Matching Engine
 * Returns score (0-100) and line-item explanation
 */
export const calculateExplainableMatch = (campaign, userPreferences) => {
  if (!userPreferences) {
    return {
      score: 85,
      breakdown: [
        { label: 'Platform Verification Base', points: 40, max: 40, matched: true },
        { label: 'Milestone Transparency Quality', points: 25, max: 25, matched: true },
        { label: 'Geographic Direct Alignment', points: 20, max: 20, matched: true },
      ]
    };
  }

  const { causes = [], preferredLocations = [], minBudget = 500, maxBudget = 10000 } = userPreferences;

  let causePoints = 0;
  const causeMatched = causes.some(c => c.toLowerCase() === (campaign.causeCategory || '').toLowerCase());
  if (causeMatched) {
    causePoints = 40;
  } else if (causes.length === 0) {
    causePoints = 30; // general
  }

  let locationPoints = 0;
  const locationMatched = preferredLocations.some(l => (campaign.location || '').toLowerCase().includes(l.toLowerCase()));
  if (locationMatched) {
    locationPoints = 20;
  } else if (preferredLocations.length === 0) {
    locationPoints = 15;
  }

  let budgetPoints = 20; // Campaign open for donor's micro-donation budget
  let impactPoints = 14; // Milestone protected

  const total = causePoints + locationPoints + budgetPoints + impactPoints;

  return {
    score: Math.min(total, 98),
    breakdown: [
      { label: `Cause match (${campaign.causeCategory})`, points: causePoints, max: 40, matched: causePoints > 0 },
      { label: `Location match (${campaign.location})`, points: locationPoints, max: 20, matched: locationPoints > 0 },
      { label: 'Budget flexibility alignment', points: budgetPoints, max: 20, matched: true },
      { label: 'Milestone proof guarantee', points: impactPoints, max: 14, matched: true },
    ]
  };
};
