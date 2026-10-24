import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Building2, User, CheckCircle2, FileText, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DocumentVerificationDropzone, { SAMPLE_DOCUMENTS } from '../../components/common/DocumentVerificationDropzone';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'NGO' ? 'NGO' : 'DONOR';

  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // NGO Specific statutory fields
  const [orgName, setOrgName] = useState('');
  const [darpanId, setDarpanId] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [pan, setPan] = useState('');
  const [status12A, setStatus12A] = useState('YES');
  const [status80G, setStatus80G] = useState('YES');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');

  // NGO Statutory Documents (with real-time automated verification)
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1-Click Fill Verified Sample NGO Documents for seamless presentation demo
  const handleLoadDemoNGO = () => {
    setRole('NGO');
    setName('Priya Kulkarni');
    setEmail(`ngo.foundation.${Math.floor(100 + Math.random() * 900)}@clearimpact.org`);
    setPassword('ngo12345');
    setOrgName('Pratham Shiksha Foundation');
    setDarpanId('MH/2024/0291845');
    setRegistrationId('REG-TRUST-98412');
    setPan('AABCP9871D');
    setStatus12A('YES');
    setStatus80G('YES');
    setCity('Nagpur');
    setState('Maharashtra');
    setDescription('Grassroots education trust dedicated to eradicating classroom dropouts in rural and semi-urban schools.');
    setMission('Providing 100% verified learning kits, nutritional support, and physical attendance registers for 5,000 students.');
    setDocuments(SAMPLE_DOCUMENTS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let ngoData = null;
      if (role === 'NGO') {
        ngoData = {
          orgName: orgName || name,
          darpanId: darpanId || `MH/2026/${Math.floor(100000 + Math.random() * 900000)}`,
          registrationId: registrationId || `REG-${Date.now()}`,
          pan: pan || 'AABCP9871D',
          status12A,
          status80G,
          address: { city: city || 'Nagpur', state: state || 'Maharashtra' },
          description: description || 'Non-profit dedicated to transparent social progress.',
          mission: mission || 'Ensuring accountable impact for every rupee received.',
          documents: documents || [],
        };
      }

      const res = await register(name, email, password, role, ngoData);

      if (res.user.role === 'NGO') {
        navigate('/ngo/dashboard');
      } else {
        navigate('/donor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create your ClearImpact Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the verified transparent philanthropic network
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('DONOR')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'DONOR'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>Donor / Philanthropist</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('NGO')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'NGO'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>NGO Organization</span>
          </button>
        </div>

        {/* Demo Fast-Fill Pill */}
        {role === 'NGO' && (
          <button
            type="button"
            onClick={handleLoadDemoNGO}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-50 to-brand-50 hover:from-indigo-100 hover:to-brand-100 border border-brand-200 text-brand-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>⚡ 1-Click Load Sample NGO with 4 Verified Documents (For Demo)</span>
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'NGO' ? 'NGO Representative Name' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Kulkarni"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya@foundation.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden"
            />
          </div>

          {/* NGO Statutory Onboarding Fields */}
          {role === 'NGO' && (
            <div className="pt-4 border-t border-slate-100 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  NGO Statutory Details & Compliance Credentials
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded">
                  Status: Verification Pending
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Pratham Shiksha Foundation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NGO Darpan ID
                  </label>
                  <input
                    type="text"
                    required
                    value={darpanId}
                    onChange={(e) => setDarpanId(e.target.value)}
                    placeholder="e.g. MH/2024/0291845"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization PAN
                  </label>
                  <input
                    type="text"
                    required
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="e.g. AABCP9871D"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono outline-hidden uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    12A Non-Profit Exemption
                  </label>
                  <select
                    value={status12A}
                    onChange={(e) => setStatus12A(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="YES">Yes (Active 12A Certificate)</option>
                    <option value="APPLIED">Applied / In Renewal</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    80G Tax Deductible
                  </label>
                  <select
                    value={status80G}
                    onChange={(e) => setStatus80G(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="YES">Yes (Donor Tax Exemption Active)</option>
                    <option value="APPLIED">Applied</option>
                    <option value="NO">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Nagpur"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Core mission and focus areas..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-hidden"
                />
              </div>

              {/* Dedicated Real-Time Document Submission & Verification Zone */}
              <div className="pt-2">
                <DocumentVerificationDropzone
                  documents={documents}
                  onChange={setDocuments}
                  orgName={orgName}
                  pan={pan}
                  darpanId={darpanId}
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Verification Standard:</strong> Newly registered NGOs remain in <strong>"Verification Pending"</strong> status. Escrow milestone releases are locked until an administrator reviews the statutory documents and grants the Verified badge.
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Verifying Documents & Creating Account...' : `Register as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
