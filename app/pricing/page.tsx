"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const PricingPage = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for casual travelers",
      features: [
        "1 trip per month",
        "Basic AI recommendations",
        "Search hotels and restaurants",
        "View day-by-day itinerary",
        "Email support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "₹99",
      period: "/month",
      description: "For regular trip planners",
      features: [
        "Unlimited trips",
        "Advanced AI recommendations",
        "Personalized suggestions",
        "Budget calculator",
        "Trip sharing & export",
        "Priority email support",
        "Offline itinerary",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Premium",
      price: "₹299",
      period: "/month",
      description: "For travel enthusiasts",
      features: [
        "Everything in Pro",
        "Real-time map integration",
        "WhatsApp notifications",
        "Group planning features",
        "Hotel & flight booking",
        "24/7 priority support",
        "Custom travel guides",
        "Travel insurance discounts",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple pricing for every traveler
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start planning your trips for free. Upgrade whenever you're ready for more features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl transition-all transform hover:scale-105 ${
              plan.highlighted
                ? "md:scale-105 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl text-white"
                : "bg-white shadow-lg"
            } p-8 flex flex-col`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
            )}

            {/* Plan Name & Price */}
            <h2 className={`text-2xl font-bold mb-2 ${
              plan.highlighted ? "text-white" : "text-gray-900"
            }`}>
              {plan.name}
            </h2>
            <p className={`text-sm mb-4 ${
              plan.highlighted ? "text-blue-100" : "text-gray-600"
            }`}>
              {plan.description}
            </p>
            
            <div className="mb-6">
              <span className={`text-4xl font-bold ${
                plan.highlighted ? "text-white" : "text-gray-900"
              }`}>
                {plan.price}
              </span>
              {plan.period && (
                <span className={`text-sm ${
                  plan.highlighted ? "text-blue-100" : "text-gray-600"
                }`}>
                  {plan.period}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <Link href="/create-new-trip" className="w-full mb-8">
              <Button
                className={`w-full py-3 font-semibold text-lg transition-all ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </Button>
            </Link>

            {/* Features */}
            <div className="flex-grow space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3">
                  <Check
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-white" : "text-green-500"
                    }`}
                  />
                  <span className={`${
                    plan.highlighted ? "text-blue-100" : "text-gray-700"
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "Can I change my plan anytime?",
              a: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
            },
            {
              q: "Do you offer discounts for annual billing?",
              a: "Yes! When you pay annually, you get 2 months free (17% discount). Contact our sales team for details.",
            },
            {
              q: "What happens if I cancel my subscription?",
              a: "You'll have access to your plan until the end of your billing period. Your saved trips will remain accessible even after cancellation.",
            },
            {
              q: "Is there a free trial?",
              a: "The Starter plan is completely free! For Pro and Premium, we offer a 7-day free trial. No credit card required.",
            },
            {
              q: "Do you offer corporate/team plans?",
              a: "Yes! We offer custom plans for teams. Please contact our sales team at sales@aitripplanner.com for more details.",
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.q}
              </h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to plan your next adventure?
        </h2>
        <p className="text-lg mb-6 text-blue-100">
          Start with our free Starter plan - no credit card required!
        </p>
        <Link href="/create-new-trip">
          <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-3 px-8">
            Start Planning Your Trip
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PricingPage;
