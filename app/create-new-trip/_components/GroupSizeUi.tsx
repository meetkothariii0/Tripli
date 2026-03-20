import React from "react";

export const SelectTravelesList = [
  {
    id: 1,
    title: "Solo",
    desc: "Perfect for independent explorers",
    icon: "👤",
    people: "1",
  },
  {
    id: 2,
    title: "Couple",
    desc: "Romantic getaway for two",
    icon: "👫",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "Family-friendly adventure",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Group exploration & fun",
    icon: "👥",
    people: "5 to 10 People",
  },
];

function GroupSizeUi({ onSelectedOption }: { onSelectedOption: (value: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {SelectTravelesList.map((item) => (
        <div
          key={item.id}
          className="group p-6 border-2 rounded-2xl bg-white hover:border-primary hover:shadow-lg cursor-pointer flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => onSelectedOption(`${item.title}: ${item.people}`)}
        >
          <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </div>
          <h2 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h2>
          <p className="text-sm text-gray-600">{item.desc}</p>
          <p className="text-xs text-primary mt-2 font-medium">{item.people}</p>
        </div>
      ))}
    </div>
  );
}

export default GroupSizeUi;
