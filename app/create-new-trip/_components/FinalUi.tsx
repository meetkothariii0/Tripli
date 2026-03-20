import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import React from 'react'

function FinalUi({viewTrip, disable}: any) {
  return (
    <div className='flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-lg shadow-md'>
        <Globe2 className='text-primary text-2xl mb-3'/>
        <h2 className='text-lg font-semibold mb-2'>✨ Your Trip is Ready! ✨</h2>
        <p className='text-gray-500 text-sm text-center mb-4'>Click below to view your personalized trip itinerary</p>
        <Button 
          disabled={disable} 
          onClick={viewTrip} 
          className='w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md'
        >
          View Trip
        </Button>
    </div>
  )
}

export default FinalUi