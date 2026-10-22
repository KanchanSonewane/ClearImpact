import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Compass,
  Building2,
  HelpCircle,
  HeartHandshake,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, ngo, logout, login } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemoSwitch = async (role) => {
    try {
      if (role === 'ADMIN') {
        await login('admin@clearimpact.org', 'admin123');
        navigate('/admin/dashboard');
      } else if (role === 'NGO') {
        await login('ngo@vidya.org', 'ngo123');
        navigate('/ngo/dashboard');
      } else if (role === 'DONOR') {
        await login('donor@clearimpact.org', 'donor123');
        navigate('/donor/dashboard');
      }
      setDropdownOpen(false);
    } catch (err) {
      console.error('Demo switch error', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                CLEAR<span className="text-brand-600">IMPACT</span>
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500 -mt-1">
                Verified Proof Platform
              </span>
            </div>
          </Link>

          {/* Desktop Public Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/campaigns"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Campaigns</span>
            </Link>
            <Link
              to="/ngos"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Verified NGOs</span>
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How It Works</span>
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Direct Quick Donate Header Button */}
            <Link
              to="/campaigns"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
              title="Browse and donate to milestone causes instantly"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Quick Donate</span>
            </Link>

            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Switch demo role instantly"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 mb-1">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('DONOR')}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between font-medium text-slate-800 transition"
                  >
                    <div>
                      <div className="font-bold">Rahul Sharma</div>
                      <div className="text-[10px] text-slate-500">Donor Persona</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">DONOR</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('NGO')}
                    className="w-full text-left px-3 py-2 hover:bg-brand-50 flex items-center justify-between font-medium text-slate-800 transition"
                  >
                    <div>
                      <div className="font-bold">Vidya Foundation</div>
                      <div className="text-[10px] text-slate-500">NGO Partner</div>
                    </div>
                    <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded">NGO</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('ADMIN')}
                    className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center justify-between font-medium text-slate-800 transition"
                  >
                    <div>
                      <div className="font-bold">Dr. Anita Roy</div>
                      <div className="text-[10px] text-slate-500">Compliance Officer</div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">ADMIN</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2.5">
                {user.role === 'NGO' && (
                  <>
                    <Link
                      to="/ngo/dashboard"
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition flex items-center gap-1.5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>NGO Dashboard</span>
                    </Link>
                    <Link
                      to="/ngo/campaign-studio"
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Studio</span>
                    </Link>
                  </>
                )}

                {user.role === 'DONOR' && (
                  <Link
                    to="/donor/dashboard"
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>My Dashboard</span>
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-xs"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/campaigns"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Browse Campaigns
          </Link>
          <Link
            to="/ngos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Verified NGOs
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/campaigns"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center"
            >
              Quick Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
