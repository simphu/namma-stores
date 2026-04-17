'use client';

import { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<any>({
    owner_name: '',
    phone: '',
    shop_name: '',
    category: '',
    address: '',
    shop_description: '',
    opening_time: '',
    closing_time: '',
    delivery_time: '',
    delivery_fee: 0,
    min_order: 0,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      {step === 1 && (
        <Step1 formData={formData} setFormData={setFormData} next={() => setStep(2)} />
      )}

      {step === 2 && (
        <Step2 formData={formData} setFormData={setFormData} next={() => setStep(3)} back={() => setStep(1)} />
      )}

      {step === 3 && (
        <Step3 formData={formData} back={() => setStep(2)} />
      )}

    </div>
  );
}