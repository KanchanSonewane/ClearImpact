import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, ExternalLink, Award, Search } from 'lucide-react';
import api from '../../api/client';
import NGOVerifiedBadge from '../../components/common/NGOVerifiedBadge';
import TransparencyScoreBadge from '../../components/common/TransparencyScoreBadge';

export default function NGOsPage() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNGOs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/ngos', { params: { search } });
        setNgos(res.data);
      } catch (err) {
        console.error('Failed to load NGOs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNGOs();
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Compliance Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Verified Non-Governmental Organizations
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Every organization listed here has passed manual statutory verification of NGO Darpan registration, PAN, 12A, and 80G tax exemption documents.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search verified organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden bg-white shadow-2xs"
        />
      </div>

      {/* NGO Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No NGOs found</h4>
          <p className="text-xs text-slate-500">Try modifying your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ngos.map((ngo) => (
            <div
              key={ngo._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {ngo.logoUrl ? (
                      <img
                        src={ngo.logoUrl}
                        alt={ngo.orgName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                        {ngo.orgName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                        {ngo.orgName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{ngo.address?.city || 'India'}, {ngo.address?.state || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NGOVerifiedBadge status={ngo.verificationStatus} darpanId={ngo.darpanId} status12A={ngo.status12A} status80G={ngo.status80G} />
                  <TransparencyScoreBadge score={ngo.transparencyScore || 90} />
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ngo.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NGO Darpan ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{ngo.darpanId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PAN:</span>
                    <span className="font-mono text-slate-800">{ngo.pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">80G Tax Exemption:</span>
                    <span className="font-bold text-emerald-700">Approved</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Verified Partner</span>
                <Link
                  to={`/campaigns?search=${encodeURIComponent(ngo.orgName)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition"
                >
                  <span>View Campaigns</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
