import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-4">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* App Download */}
        <div className="mb-5">
          <p className="font-display text-sm font-700 text-darker mb-2.5">
            Download the Namma Stores App
          </p>
          <div className="flex items-center gap-3">
            {/* Google Play */}
            <div className="flex items-center gap-2 bg-darker text-white rounded-xl px-4 py-2.5 cursor-pointer hover:bg-dark transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" aria-hidden="true">
                <path d="M3.18 23.76c.37.2.8.2 1.18 0l11.5-6.64-2.5-2.5-10.18 9.14zm-1.18-21.5v19.48l10.5-9.74L2 2.26zm14.5 8.24L4.36.24C3.98.04 3.55.04 3.18.24L13.5 10.5l3-3zm1.5.86l-3 3 3 3 3.5-2.02c1-.58 1-.98 0-1.56L17 10.5z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-gray-300 font-body">GET IT ON</span>
                <span className="text-xs font-display font-700">Google Play</span>
              </div>
            </div>

            {/* App Store */}
            <div className="flex items-center gap-2 bg-darker text-white rounded-xl px-4 py-2.5 cursor-pointer hover:bg-dark transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-gray-300 font-body">DOWNLOAD ON THE</span>
                <span className="text-xs font-display font-700">App Store</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Shop Info */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-start gap-2">
            <Icon name="MapPinIcon" size={14} className="text-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-display font-600 text-darker">Namma Fresh Mart</p>
              <p className="text-xs text-muted font-body leading-relaxed">
                #42, 5th Cross, Koramangala 5th Block,<br />
                Bengaluru, Karnataka – 560095
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="PhoneIcon" size={14} className="text-muted flex-shrink-0" />
            <span className="text-xs text-muted font-body">+91 98765 43210</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* FSSAI License */}
        <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="ShieldCheckIcon" size={16} className="text-green-600" variant="solid" />
          </div>
          <div>
            <p className="text-xs font-display font-700 text-darker">FSSAI Licensed</p>
            <p className="text-[11px] text-muted font-body mt-0.5">
              License No: 11224999000123 &nbsp;·&nbsp; Valid till Dec 2025
            </p>
            <p className="text-[10px] text-faint font-body mt-1">
              Food safety and standards authority of India certified
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[11px] text-faint font-body mt-5">
          © 2024 Namma Stores · All rights reserved
        </p>
      </div>
    </footer>
  );
}
