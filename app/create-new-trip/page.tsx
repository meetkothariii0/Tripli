"use client";
import React, { useState } from 'react';
import ChatBox from './_components/ChatBox';
import MapComponent from './_components/MapComponent';

const CreateNewTrip: React.FC = () => {
  const [destination, setDestination] = useState<string>('');

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:p-10 min-h-screen'>
        <div className='flex flex-col'>
           <ChatBox />
        </div>
        <div className='flex flex-col'>
            <MapComponent destination={destination} />
        </div>
    </div>
  );
};

export default CreateNewTrip;