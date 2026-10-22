import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  Coins,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Sliders,
  Calendar,
  Search,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Lock,
  Download,
  FileText
} from 'lucide-react';
import api from '../../api/client';
import CampaignCard from '../../components/common/CampaignCard';
import DonationModal from '../../components/common/DonationModal';
import { formatINR, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user, updatePreferences } = useAuth();

  const [activeTab, setActiveTab] = useState('EXPLORE'); // 'EXPLORE' | 'IMPACT' | 'TAX_RECEIPTS'
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  // Quick donate modal state
  const [selectedQuickCampaign, setSelectedQuickCampaign] = useState(null);

  // Preferences form
  const [selectedCauses, setSelectedCauses] = useState(user?.preferences?.causes || ['Education', 'Healthcare']);
  const [selectedLocations, setSelectedLocations] = useState(user?.preferences?.preferredLocations || ['Maharashtra', 'Nagpur']);

  const fetchDonorData = async () => {
    try {
      const [donRes, campRes] = await Promise.all([
        api.get('/donations/my'),
        api.get('/campaigns'),
      ]);
      setDonations(donRes.data);
      setCampaigns(campRes.data);
    } catch (err) {
      console.error('Failed to load donor data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      await updatePreferences({
        causes: selectedCauses,
        preferredLocations: selectedLocations,
      });
      setIsPrefModalOpen(false);
    } catch (err) {
      alert('Failed to update preferences.');
    }
  };

  const toggleCause = (c) => {
    if (selectedCauses.includes(c)) {
      setSelectedCauses(selectedCauses.filter(item => item !== c));
    } else {
      setSelectedCauses([...selectedCauses, c]);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.title?.toLowerCase().includes(q) ||
           c.causeCategory?.toLowerCase().includes(q) ||
           c.location?.toLowerCase().includes(q) ||
           c.ngoId?.orgName?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP WELCOME & SUMMARY BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Donor Account: {user?.name || 'Rahul Sharma'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Donor Impact Center
          </h1>
          <p className="text-xs text-slate-500">
            Give with confidence. Every rupee is held in milestone escrow until on-ground evidence is verified.
          </p>
        </div>

        {/* 3 Clear Metric Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Total Given</span>
            <span className="text-base font-black text-slate-900">{formatINR(totalDonated)}</span>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Causes Backed</span>
            <span className="text-base font-black text-slate-900">{donations.length}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPrefModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition flex items-center gap-1.5"
            title="Edit your matching causes and locations"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* 2. THREE CRYSTAL-CLEAR TABS (Eliminates Skimming & Overwhelm) */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('EXPLORE')}
          className={`pb-3 px-4 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'EXPLORE'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Discover & Quick Donate</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('IMPACT')}
          className={`pb-3 px-4 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'IMPACT'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>2. My Impact & Evidence Proof ({donations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TAX_RECEIPTS')}
          className={`pb-3 px-4 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'TAX_RECEIPTS'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. 80G Tax Certificates</span>
        </button>
      </div>

      {/* TAB 1: DISCOVER & QUICK DONATE */}
      {activeTab === 'EXPLORE' && (
        <div className="space-y-6">
          {/* Quick Search & Instant Donate Helper */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find a cause, NGO, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden"
              />
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All campaigns feature direct <strong>[Donate Now]</strong> in 1 click</span>
            </div>
          </div>

          {/* Campaign Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <p className="text-sm font-bold text-slate-700">No matching campaigns found</p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((camp) => (
                <CampaignCard
                  key={camp._id}
                  campaign={camp}
                  onDonationComplete={() => fetchDonorData()}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY IMPACT & EVIDENCE PROOF */}
      {activeTab === 'IMPACT' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Proof-of-Impact Guarantee:</strong> Click <strong>[Track Proof of Impact]</strong> below to see timestamped photos, risk audits, and milestone fund releases.
            </span>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">You haven't backed any campaigns yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select any verified cause to make your first milestone-protected donation.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('EXPLORE')}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-700 transition"
              >
                Discover Causes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((don) => (
                <div
                  key={don._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-start gap-4">
                    {don.campaignId?.coverImage && (
                      <img
                        src={don.campaignId.coverImage}
                        alt="Cover"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {don.campaignId?.title || 'Milestone Campaign'}
                      </h4>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-extrabold text-emerald-700">{formatINR(don.amount)}</span>
                        <span>•</span>
                        <span>{formatDate(don.createdAt)}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {don.taxReceiptNumber || '80G-VERIFIED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Link
                      to={`/donor/impact/${don._id}`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Track Proof of Impact</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 80G TAX CERTIFICATES */}
      {activeTab === 'TAX_RECEIPTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official 80G Tax Exemption Receipts
              </h3>
              <p className="text-xs text-slate-500">
                All donations to ClearImpact verified NGOs qualify for 50% deduction under Section 80G of the Indian Income Tax Act.
              </p>
            </div>
          </div>

          {donations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No tax receipts available yet.</div>
          ) : (
            <div className="space-y-3">
              {donations.map((don) => (
                <div key={don._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-800 text-sm block">
                      Receipt #{don.taxReceiptNumber || '80G-VERIFIED'}
                    </span>
                    <span className="text-slate-500">
                      Amount: <strong>{formatINR(don.amount)}</strong> • Date: {formatDate(don.createdAt)} • Earmark: {don.campaignId?.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print 80G Receipt</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preferences Modal */}
      {isPrefModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              Donor Cause Preferences
            </h3>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Causes of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Education', 'Healthcare', 'Environment', 'Hunger Relief', 'Rural Development'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCause(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedCauses.includes(c)
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Location Scope
                </label>
                <input
                  type="text"
                  value={selectedLocations.join(', ')}
                  onChange={(e) => setSelectedLocations(e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g. Maharashtra, Nagpur, Pune"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPrefModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
