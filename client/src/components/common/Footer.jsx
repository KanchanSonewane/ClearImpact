import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, CheckCircle2, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                CLEAR<span className="text-brand-500">IMPACT</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Transparent NGO donations with verified proof-of-impact. Restoring donor trust through milestone-based escrow, photographic risk inspection, and grounded reporting.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Grounded AI Architecture</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Explore Platform
            </h4>
            <ul className="space-y-2">
              <li><Link to="/campaigns" className="hover:text-white transition">Active Campaigns</Link></li>
              <li><Link to="/ngos" className="hover:text-white transition">Verified NGOs Directory</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">Milestone Escrow Process</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About ClearImpact</Link></li>
            </ul>
          </div>

          {/* Verification Standards */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Verification Standards
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Manual Statutory Review</li>
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-brand-400" /> Milestone Escrow Protocol</li>
              <li className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-indigo-400" /> Perceptual Hash Image Audit</li>
              <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400" /> Explainable Risk Scoring</li>
            </ul>
          </div>

          {/* Demo Project Disclosure */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              Idea Lab Demonstration
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This application is an educational prototype demonstrating transparent social impact workflows. Payment steps use safe Razorpay Sandbox test credentials. All AI outputs strictly enforce factual claim boundaries.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
              Demo Version 1.0.0 • College Idea Lab Project
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ClearImpact. Designed with transparency over hype.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">Security & Claim Policy</Link>
            <span>•</span>
            <Link to="/how-it-works" className="hover:text-slate-400">Risk Engine Specs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
