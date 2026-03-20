"use client";

import React, { useState } from 'react';

interface SelectDaysProps {
  onSelectedOption: (value: string) => void;
}

function SelectDays({ onSelectedOption }: SelectDaysProps) {
  const [selectedDays, setSelectedDays] = useState<number>(3);

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
    onSelectedOption(`${days} Days`);
  };

  const dayOptions = [
    { days: 1, label: '1 day', desc: 'Quick getaway' },
    { days: 2, label: '2 days', desc: 'Weekend trip' },
    { days: 3, label: '3 days', desc: 'Short vacation' },
    { days: 5, label: '5 days', desc: 'Mid vacation' },
    { days: 7, label: '1 week', desc: 'Full week' },
    { days: 10, label: '10 days', desc: 'Extended trip' },
    { days: 14, label: '2 weeks', desc: 'Long vacation' },
    { days: 21, label: '3 weeks', desc: 'Extended travel' },
    { days: 30, label: '1 month', desc: 'Month-long adventure' },
  ];

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-4">Or select from preset options:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {dayOptions.map((option) => (
          <button
            key={option.days}
            onClick={() => handleDaysChange(option.days)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedDays === option.days
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-gray-200 bg-white hover:border-primary text-gray-800'
            }`}
          >
            <div className="font-bold text-lg">{option.label}</div>
            <div className="text-xs text-gray-600">{option.desc}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Or enter custom days (1-30):
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="30"
            value={selectedDays}
            onChange={(e) => handleDaysChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-center min-w-12">
            <div className="text-2xl font-bold text-primary">{selectedDays}</div>
            <div className="text-xs text-gray-600">days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectDays