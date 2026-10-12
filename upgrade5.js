const fs = require('fs');
const path = require('path');

const content = \`
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

const STEPS = [
  { id: 'origin', label: 'Where are you starting from?' },
  { id: 'destination', label: 'Where do you want to go?' },
  { id: 'dates', label: 'When are you travelling? (Select From and To dates)' },
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleNext = () => {
    if (STEPS[step].id === 'dates') {
      if (!dateRange?.from || !dateRange?.to) {
        toast.error('Please select both a start and end date.');
        return;
      }
      setFormData({
        ...formData,
        dates: \`From \${format(dateRange.from, 'PP')} to \${format(dateRange.to, 'PP')}\`
      });
    }
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

      <div className="border p-6 rounded-lg shadow-sm bg-white">
        <h2 className="text-xl mb-4 font-semibold">{current.label}</h2>
        
        {current.id === 'dates' ? (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="bg-white p-4 rounded-md shadow-sm"
            />
            <div className="mt-4 text-sm font-medium text-gray-700">
              {dateRange?.from ? (
                dateRange.to ? (
                  \`Selected: \${format(dateRange.from, 'PP')} – \${format(dateRange.to, 'PP')}\`
                ) : (
                  \`Selected Start: \${format(dateRange.from, 'PP')}. Now select end date.\`
                )
              ) : (
                'Please select your travel dates.'
              )}
            </div>
          </div>
        ) : (
          <Input 
            className="mb-4"
            placeholder={\`Enter \${current.id}...\`}
            value={formData[current.id] || ''}
            onChange={e => setFormData({ ...formData, [current.id]: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') handleNext(); }}
          />
        )}
        
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
\`;

fs.writeFileSync(path.join(__dirname, 'app/create-new-trip/page.tsx'), content.trim() + '\\n', 'utf8');
console.log("Updated page with calendar");
