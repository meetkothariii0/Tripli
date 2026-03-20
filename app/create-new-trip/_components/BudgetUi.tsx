import React from "react";

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💵",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💰",
    color: " text-yellow-600",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don’t worry about cost",
    icon: "💸",
    color: "bg-purple-100 text-purple-600",
  },
];

function BudgetUi({ onSelectedOption }: { onSelectedOption: (value: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch mt-2">
      {SelectBudgetOptions.map((item) => (
        <div
          key={item.id}
          className={`p-4 border rounded-2xl bg-white hover:border-primary cursor-pointer flex flex-col items-center text-center transition ${item.color}`}
          onClick={() => onSelectedOption(`${item.title}: ${item.desc}`)}
        >
          <div className="text-4xl mb-2">{item.icon}</div>
          <h2 className="font-semibold text-lg">{item.title}</h2>
          <p className="text-sm text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default BudgetUi;
