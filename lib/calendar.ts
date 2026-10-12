import { TripPlan } from "./providers/types";

export function downloadTripCalendar(trip: TripPlan) {
  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // Base start date: parse from trip.dates or start tomorrow
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);

  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tripli//AI Trip Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  trip.itinerary?.forEach((day, index) => {
    const eventDate = new Date(startDate);
    eventDate.setDate(startDate.getDate() + index);

    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(eventDate.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${dayOfMonth}`;

    day.activities?.forEach((act, actIdx) => {
      const summary = `${act.place_name} (${trip.destination})`;
      const desc = `${act.why_this}\\nAddress: ${act.place_address}\\nCost: ${act.estimated_cost}`;
      const uid = `tripli-${trip.id}-d${day.day}-a${actIdx}-${dateStr}@tripli.app`;

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowStr}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${desc}`,
        `LOCATION:${act.place_address || trip.destination}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });
  });

  icsContent.push("END:VCALENDAR");

  const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${trip.destination.toLowerCase()}-itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
