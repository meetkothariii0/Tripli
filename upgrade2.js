const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
};

write('app/create-new-trip/page.tsx', `
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const STEPS = [
  { id: 'origin', label: 'Where are you starting from?' },
  { id: 'destination', label: 'Where do you want to go?' },
  { id: 'dates', label: 'When are you travelling?' },
  { id: 'travelers', label: 'Who is travelling?' },
  { id: 'budget', label: 'What is your budget?' },
  { id: 'style', label: 'What is your travel style?' },
  { id: 'stay', label: 'Preferred stay type?' },
  { id: 'food', label: 'Food preferences?' },
  { id: 'transport', label: 'Preferred transport?' },
  { id: 'pace', label: 'Trip pace?' },
];

export default function CreateTripStepper() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    toast.info("Generating your itinerary...");
    try {
      const res = await fetch('/api/aimodel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: JSON.stringify(formData) }],
          isFinal: true
        })
      });
      if (res.ok) {
        toast.success("Trip created!");
        router.push('/my-trips');
      } else {
        toast.error("Failed to create trip. Retrying...");
      }
    } catch(e) {
      toast.error("Error generating trip.");
    } finally {
      setLoading(false);
    }
  };

  const current = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Plan your perfect trip</h1>
      <p className="text-gray-500 mb-8">Step {step + 1} of {STEPS.length}</p>

      <div className="border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl mb-4">{current.label}</h2>
        <Input 
          className="mb-4"
          placeholder={\`Enter \${current.id}...\`}
          value={formData[current.id] || ''}
          onChange={e => setFormData({ ...formData, [current.id]: e.target.value })}
        />
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate My Trip'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
`);
console.log("Updated create-new-trip page with stepper UI.");
