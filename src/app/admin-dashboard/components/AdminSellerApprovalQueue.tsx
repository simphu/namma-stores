'use client';
import React, { useState } from 'react';
import { Check, X, MapPin, Store, Clock, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface SellerApplication {
  id: string;
  name: string;
  shopName: string;
  category: string;
  location: string;
  phone: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  gstNo?: string;
  fssaiNo?: string;
}

const initialApplications: SellerApplication[] = [
  { id: 'app-001', name: 'Sanjay Gupta', shopName: 'Gupta Kirana Store', category: 'Grocery', location: 'Mahadevapura, Whitefield', phone: '+91 98001 23456', appliedAt: '2 hrs ago', status: 'pending', gstNo: '29AADCG1234A1Z5' },
  { id: 'app-002', name: 'Lakshmi Devi', shopName: 'Lakshmi Dairy & Sweets', category: 'Dairy & Sweets', location: 'Kadugodi, Bangalore', phone: '+91 87002 34567', appliedAt: '5 hrs ago', status: 'pending', fssaiNo: '11223344556677' },
  { id: 'app-003', name: 'Mohammed Irfan', shopName: 'Irfan Halal Meat Shop', category: 'Meat & Poultry', location: 'Whitefield Main Road', phone: '+91 76003 45678', appliedAt: '8 hrs ago', status: 'pending', fssaiNo: '22334455667788' },
  { id: 'app-004', name: 'Rekha Nair', shopName: 'Nair Pharmacy', category: 'Pharmacy', location: 'Varthur Road, Whitefield', phone: '+91 65004 56789', appliedAt: '1 day ago', status: 'pending', gstNo: '29AAACN5678B2Z6' },
  { id: 'app-005', name: 'Prasad Rao', shopName: 'Prasad Vegetable Corner', category: 'Vegetables & Fruits', location: 'Brookefield, Bangalore', phone: '+91 54005 67890', appliedAt: '1 day ago', status: 'pending' },
  { id: 'app-006', name: 'Fatima Begum', shopName: 'Fatima Catering Services', category: 'Catering', location: 'Hoodi, Whitefield', phone: '+91 43006 78901', appliedAt: '2 days ago', status: 'approved' },
  { id: 'app-007', name: 'Dinesh Kumar', shopName: 'DK Electronics', category: 'Electronics', location: 'ITPL Road, Whitefield', phone: '+91 32007 89012', appliedAt: '2 days ago', status: 'rejected' },
];

type Props = {
  sellers: any;
  loading: boolean;
};

export default function AdminSellerApprovalQueue({ sellers, loading }: Props) {
  const [applications, setApplications] = useState<SellerApplication[]>(initialApplications);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ id: string; action: 'approve' | 'reject'; name: string } | null>(null);

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const displayed = filter === 'pending' ? applications.filter(a => a.status === 'pending') : applications;

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a));
    const app = applications.find(a => a.id === id);
    if (action === 'approve') {
      toast.success(`${app?.shopName} approved`, { description: 'Seller can now list products and accept orders.' });
    } else {
      toast.error(`${app?.shopName} rejected`, { description: 'Seller has been notified.' });
    }
    setConfirmModal(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-700 text-sm text-stone-800">Seller Approvals</h3>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-display font-700 rounded-full border border-red-200 animate-pulse-soft">
                  {pendingCount} pending
                </span>
              )}
            </div>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
              {(['pending', 'all'] as const).map(f => (
                <button
                  key={`af-${f}`}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-display font-600 transition-all duration-150 ${
                    filter === f ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'
                  }`}
                >
                  {f === 'pending' ? 'Pending' : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-stone-50 max-h-96 overflow-y-auto">
          {displayed.length === 0 ? (
            <div className="py-10 text-center">
              <Store size={32} className="text-stone-300 mx-auto mb-3" />
              <p className="font-display font-600 text-stone-500 text-sm">No pending approvals</p>
              <p className="text-xs text-stone-400 font-body mt-1">All seller applications have been reviewed</p>
            </div>
          ) : (
            displayed.map(app => {
              const isExpanded = expandedApp === app.id;
              return (
                <div key={app.id} className="hover:bg-stone-50/50 transition-colors">
                  <div className="px-4 py-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-display font-700 text-orange-600">
                          {app.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-display font-700 text-stone-800">{app.shopName}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-display font-700 border ${
                            app.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            app.status === 'approved'? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-body mt-0.5">{app.name} · {app.category}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={10} className="text-stone-400" />
                          <p className="text-xs text-stone-400 font-body">{app.location}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock size={10} className="text-stone-400" />
                          <p className="text-xs text-stone-400 font-body">Applied {app.appliedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setConfirmModal({ id: app.id, action: 'approve', name: app.shopName })}
                              className="w-7 h-7 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-lg flex items-center justify-center transition-colors"
                              title="Approve seller account"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => setConfirmModal({ id: app.id, action: 'reject', name: app.shopName })}
                              className="w-7 h-7 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                              title="Reject seller account"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                          className="w-7 h-7 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="mt-3 animate-fade-in">
                        <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 border border-stone-100">
                          <div className="flex gap-2">
                            <span className="text-[10px] font-display font-700 text-stone-500 w-16 flex-shrink-0">Phone</span>
                            <span className="text-[10px] font-body text-stone-700">{app.phone}</span>
                          </div>
                          {app.gstNo && (
                            <div className="flex gap-2">
                              <span className="text-[10px] font-display font-700 text-stone-500 w-16 flex-shrink-0">GST No.</span>
                              <span className="text-[10px] font-body text-stone-700 font-mono">{app.gstNo}</span>
                            </div>
                          )}
                          {app.fssaiNo && (
                            <div className="flex gap-2">
                              <span className="text-[10px] font-display font-700 text-stone-500 w-16 flex-shrink-0">FSSAI</span>
                              <span className="text-[10px] font-body text-stone-700 font-mono">{app.fssaiNo}</span>
                            </div>
                          )}
                          {!app.gstNo && !app.fssaiNo && (
                            <p className="text-[10px] text-amber-600 font-body">⚠ No GST/FSSAI documents submitted</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl animate-fade-in">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              confirmModal.action === 'approve' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {confirmModal.action === 'approve'
                ? <Check size={22} className="text-green-600" />
                : <X size={22} className="text-red-600" />
              }
            </div>
            <h3 className="font-display font-700 text-lg text-stone-800">
              {confirmModal.action === 'approve' ? 'Approve Seller?' : 'Reject Seller?'}
            </h3>
            <p className="text-sm text-stone-600 font-body mt-2">
              {confirmModal.action === 'approve'
                ? `Approving "${confirmModal.name}" will allow them to list products and accept orders on Namma Stores.`
                : `Rejecting "${confirmModal.name}" will notify them via SMS and prevent them from listing on the platform.`
              }
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-display font-600 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirmModal.id, confirmModal.action)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-display font-700 text-white transition-colors ${
                  confirmModal.action === 'approve' ?'bg-green-500 hover:bg-green-600' :'bg-red-500 hover:bg-red-600'
                }`}
              >
                {confirmModal.action === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}