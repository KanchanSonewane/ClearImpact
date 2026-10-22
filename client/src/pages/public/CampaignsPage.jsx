import React, { useEffect, useState } from 'react';
import { Search, Filter, Compass, Sparkles, Building2, MapPin } from 'lucide-react';
import api from '../../api/client';
import CampaignCard from '../../components/common/CampaignCard';
import { useAuth } from '../../context/AuthContext';

export default function CampaignsPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCause, setSelectedCause] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const causes = [
    'All',
    'Education',
    'Healthcare',
    'Environment',
    'Hunger Relief',
    'Rural Development',
    'Women Empowerment'
  ];

  const locations = [
    'All',
    'Maharashtra',
    'Nagpur',
    'Pune',
    'Karnataka',
    'Kolar'
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCause !== 'All') params.cause = selectedCause;
        if (selectedLocation !== 'All') params.location = selectedLocation;
        if (search.trim()) params.search = search.trim();

        const res = await api.get('/campaigns', { params });
        setCampaigns(res.data);
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [selectedCause, selectedLocation, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Milestone-Verified Projects</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Transparent Campaigns
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Every listed initiative is protected by milestone escrow. You can track physical photos and verified reports as funds are unlocked.
          </p>
        </div>

        {user?.role === 'DONOR' && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 max-w-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Personalized Matching Active:</strong> Campaign cards highlight compatibility with your preferences.
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords, NGO name, or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden bg-white shadow-2xs"
            />
          </div>

          {/* Location Dropdown */}
          <div className="sm:w-56">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden bg-white shadow-2xs"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : `📍 ${loc}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cause Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {causes.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCause(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCause === c
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No campaigns found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or cause category filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCause('All');
              setSelectedLocation('All');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => (
            <CampaignCard key={camp._id} campaign={camp} />
          ))}
        </div>
      )}
    </div>
  );
}
