"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, QuestionConfig, QuestionOption } from "@/lib/questions";
import { tripStore } from "@/lib/tripStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Edit2,
  Plus,
  Minus,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import "react-day-picker/dist/style.css";

export default function CreateTripPage() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    origin: "Bengaluru",
    destination: "Goa",
    trip_length: "3",
    total_budget: "₹30,000 - ₹80,000",
    spending_style: "Mid-range",
    pace: "Balanced",
    travelers: "Couple",
    food_pref: "No preference",
    transport: "Flight",
    travel_style: ["Relaxed", "Food"],
    stay_type: ["3-4★ hotel"],
    must_haves: ["Beaches"]
  });

  // Custom text input toggle
  const [customInputOpen, setCustomInputOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");

  // Stepper for adults/children
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);

  // Date range picker state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Highlighting transition state for 250ms auto-advance
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  // Generating status
  const [loading, setLoading] = useState(false);

  // Completed all steps view
  const [showConfirmation, setShowConfirmation] = useState(false);

  const currentQ: QuestionConfig = QUESTIONS[stepIndex];

  // Auto-advance helper for single-select
  const handleSingleSelect = (val: string) => {
    setHighlightedValue(val);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));

    setTimeout(() => {
      setHighlightedValue(null);
      if (stepIndex < QUESTIONS.length - 1) {
        setStepIndex(stepIndex + 1);
        setCustomInputOpen(false);
        setCustomInputValue("");
      } else {
        setShowConfirmation(true);
      }
    }, 250);
  };

  // Multi-select toggle
  const handleMultiSelect = (val: string) => {
    const currentList: string[] = Array.isArray(answers[currentQ.id]) ? [...answers[currentQ.id]] : [];
    const exists = currentList.includes(val);
    const updated = exists ? currentList.filter((item) => item !== val) : [...currentList, val];
    setAnswers((prev) => ({ ...prev, [currentQ.id]: updated }));
  };

  const handleNextStep = () => {
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex(stepIndex + 1);
      setCustomInputOpen(false);
      setCustomInputValue("");
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrevStep = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
      return;
    }
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setCustomInputOpen(false);
      setCustomInputValue("");
    }
  };

  const handleRemoveAnswer = (key: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleCustomSubmit = () => {
    if (!customInputValue.trim()) return;
    if (currentQ.type === "multi") {
      const currentList: string[] = Array.isArray(answers[currentQ.id]) ? [...answers[currentQ.id]] : [];
      setAnswers((prev) => ({ ...prev, [currentQ.id]: [...currentList, customInputValue.trim()] }));
    } else {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: customInputValue.trim() }));
      handleNextStep();
    }
    setCustomInputValue("");
    setCustomInputOpen(false);
  };

  const handleGenerateTrip = async () => {
    setLoading(true);
    toast.info("Crafting your intelligent itinerary...");

    try {
      const res = await fetch("/api/aimodel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: answers,
          isFinal: true
        })
      });

      const data = await res.json();
      if (res.ok && data.trip && data.tripId) {
        // Save to tripStore single source of truth
        const days = data.trip.durationDays || data.trip.itinerary?.length || 3;
        tripStore.save(data.trip, `${data.trip.destination} · ${days} day${days > 1 ? "s" : ""}`);

        toast.success("Trip created successfully!");
        router.push(`/trip/${data.tripId}/itinerary`);
      } else {
        throw new Error(data.error || "Failed to create trip");
      }
    } catch (err: any) {
      console.error("Trip generation error", err);
      toast.error(err.message || "Something went wrong while generating trip.");
    } finally {
      setLoading(false);
    }
  };

  const answeredKeys = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== "" && !(Array.isArray(answers[k]) && answers[k].length === 0)
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-semibold text-gray-700">
            {showConfirmation ? "Final Review" : `Step ${stepIndex + 1} of ${QUESTIONS.length}`}
          </span>
          <span className="text-xs">
            {Math.round(((stepIndex + 1) / QUESTIONS.length) * 100)}% completed
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: showConfirmation ? "100%" : `${((stepIndex + 1) / QUESTIONS.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Selected-answers summary row of small removable chips */}
      {answeredKeys.length > 0 && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Selected Answers:
          </div>
          <div className="flex flex-wrap gap-2">
            {answeredKeys.map((key) => {
              const val = answers[key];
              const displayVal = Array.isArray(val) ? val.join(", ") : String(val);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-800 text-xs px-2.5 py-1 rounded-full shadow-xs"
                >
                  <span className="font-medium text-gray-500">{key}:</span>
                  <span className="font-semibold truncate max-w-[150px]">{displayVal}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(key)}
                    className="hover:text-red-500 transition-colors ml-0.5"
                    aria-label={`Remove ${key}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Questionnaire Card */}
      {!showConfirmation ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
          {/* Question Label */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {currentQ.label}
            </h2>
            <p className="text-sm text-gray-500">
              {currentQ.type === "multi"
                ? "Select all that apply, then click Continue."
                : currentQ.type === "date-range"
                ? "Pick a date preset or choose a calendar date range."
                : "Tap an option to select and auto-advance."}
            </p>
          </div>

          {/* Special UI: Date Range Picker */}
          {currentQ.type === "date-range" && (
            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range && range.from && range.to) {
                    const fromDate = range.from;
                    const toDate = range.to;
                    setAnswers((prev) => ({
                      ...prev,
                      dates: `From ${format(fromDate, "PP")} to ${format(toDate, "PP")}`
                    }));
                  }
                }}
                className="bg-white p-3 rounded-lg shadow-xs"
              />
              <div className="mt-3 text-sm font-medium text-gray-700">
                {dateRange && dateRange.from && dateRange.to ? (
                  <span className="text-emerald-700 font-semibold">
                    Selected: {format(dateRange.from, "PP")} – {format(dateRange.to, "PP")}
                  </span>
                ) : (
                  <span className="text-gray-500">Or tap one of the quick chips below:</span>
                )}
              </div>
            </div>
          )}

          {/* Special UI: Stepper for Adults/Children */}
          {currentQ.hasStepper && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-bold text-gray-800">Adults</div>
                  <div className="text-xs text-gray-500">Age 12+</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const next = Math.max(1, adultCount - 1);
                      setAdultCount(next);
                      setAnswers((prev) => ({
                        ...prev,
                        traveler_breakdown: `${next} Adults, ${childCount} Children`
                      }));
                    }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-bold text-base min-w-[20px] text-center">
                    {adultCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const next = adultCount + 1;
                      setAdultCount(next);
                      setAnswers((prev) => ({
                        ...prev,
                        traveler_breakdown: `${next} Adults, ${childCount} Children`
                      }));
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-bold text-gray-800">Children</div>
                  <div className="text-xs text-gray-500">Under 12</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const next = Math.max(0, childCount - 1);
                      setChildCount(next);
                      setAnswers((prev) => ({
                        ...prev,
                        traveler_breakdown: `${adultCount} Adults, ${next} Children`
                      }));
                    }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-bold text-base min-w-[20px] text-center">
                    {childCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const next = childCount + 1;
                      setChildCount(next);
                      setAnswers((prev) => ({
                        ...prev,
                        traveler_breakdown: `${adultCount} Adults, ${next} Children`
                      }));
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Large Tappable Options Chips/Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {currentQ.options.map((opt) => {
              const isSelected =
                currentQ.type === "multi"
                  ? Array.isArray(answers[currentQ.id]) && answers[currentQ.id].includes(opt.value)
                  : answers[currentQ.id] === opt.value;
              const isFlashing = highlightedValue === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (currentQ.type === "multi") {
                      handleMultiSelect(opt.value);
                    } else {
                      handleSingleSelect(opt.value);
                    }
                  }}
                  className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                    isFlashing
                      ? "border-primary bg-primary/15 scale-[1.02]"
                      : isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-2xl mr-2">{opt.emoji || "📍"}</span>
                    {isSelected && (
                      <span className="bg-primary text-white rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-gray-900 text-base">{opt.label}</div>
                  {opt.helperText && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {opt.helperText}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Other / Type your own card */}
            {currentQ.allowCustom && (
              <button
                type="button"
                onClick={() => setCustomInputOpen(!customInputOpen)}
                className={`flex flex-col justify-center text-left p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                  customInputOpen
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  <Edit2 className="w-4 h-4 text-primary" />
                  <span>Other / type your own</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Specify custom answer</div>
              </button>
            )}
          </div>

          {/* Custom Input Box if toggled */}
          {customInputOpen && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex gap-2">
              <Input
                placeholder={`Type custom answer for ${currentQ.label}...`}
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomSubmit();
                }}
                className="bg-white"
                autoFocus
              />
              <Button onClick={handleCustomSubmit} className="shrink-0">
                Save
              </Button>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={stepIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {currentQ.skippable && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleNextStep}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Skip
                </Button>
              )}

              {currentQ.type === "multi" && (
                <Button onClick={handleNextStep} className="gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Final Confirmation Card with Edit link per answer */
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Confirm Your Trip Preferences
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review your selections before generating your personalized itinerary.
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {QUESTIONS.map((q, idx) => {
              const val = answers[q.id];
              const displayVal = Array.isArray(val)
                ? val.join(", ")
                : val
                ? String(val)
                : "Not specified";

              return (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 flex items-start justify-between"
                >
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {q.id.replace("_", " ")}
                    </div>
                    <div className="font-bold text-gray-900 text-sm mt-0.5">
                      {displayVal}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmation(false);
                      setStepIndex(idx);
                    }}
                    className="text-primary hover:underline text-xs font-semibold shrink-0 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Questions
            </Button>

            <Button
              size="lg"
              onClick={handleGenerateTrip}
              disabled={loading}
              className="gap-2 px-8 text-base font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate My Trip
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
