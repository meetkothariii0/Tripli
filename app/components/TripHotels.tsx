import Image from "next/image";

type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  google_maps_link?: string;
  image_url?: string;
  hotel_image_url?: string;
  rating?: number;
};

interface TripHotelsProps {
  hotels: Hotel[];
}

export default function TripHotels({ hotels }: TripHotelsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
      {hotels.map((hotel, index) => (
        <div key={index} className="flex flex-col gap-1">
          <Image
            src={hotel.image_url || hotel.hotel_image_url || "/placeholder.jpg"}
            alt="place-image"
            width={400}
            height={300}
            className="rounded-xl shadow object-cover mb-2"
          />
          <h2 className="font-semibold text-lg">{hotel.hotel_name}</h2>
          <h2 className="text-gray-500">{hotel.hotel_address}</h2>
          <div className="flex justify-between items-center">
            <p className="flex gap-2 text-green-600">
              ₹ {hotel.price_per_night}
            </p>
            <p className="flex gap-2 text-yellow-500">
              ⭐ {hotel.rating || "N/A"}
            </p>
          </div>
          {hotel.google_maps_link && (
            <a
              href={hotel.google_maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              <button className="border px-4 py-1 rounded outline">View</button>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}