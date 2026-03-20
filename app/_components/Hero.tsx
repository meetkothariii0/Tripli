"use client";

import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { Plane, Sparkles, Gem, Mountain, Send, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export const suggestions = [
  { title: 'Start Planning', icon: <Plane className='text-blue-400 h-5 w-5' /> },
  { title: 'Get Inspired', icon: <Sparkles className='text-green-400 h-5 w-5' /> },
  { title: 'Hidden Gems', icon: <Gem className='text-orange-400 h-5 w-5' /> },
  { title: 'Adventure Ideas', icon: <Mountain className='text-yellow-400 h-5 w-5' /> },
];

export default function Hero() {

  const {user}=useUser();
  const router = useRouter();
  const onSend = () => {
    if(!user){
      router.push('/sign-in')
      return;
    }
    router.push('/create-new-trip'); // Navigate to create trip planner web page
    }
    //Navigate to create trip planner web page

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-3xl w-full space-y-6">
        <h2 className="md:text-5xl text-3xl font-bold whitespace-nowrap">
          Your travel companion for the perfect <span className="text-primary">journey</span>
        </h2>

        <p className='text-lg text-gray-600'>
          Get personalized recommendations for hotels, restaurants, activities, and day-by-day itineraries. Powered by smart AI.
        </p>

        <div>
          <div className='border rounded-2xl p-4 shadow relative'>
            <Textarea
              placeholder='Planning a trip to Bali? Tell me about it...'
              className='w-full h-28 bg-transparent border-none focus-visible:ring-0 resize-none'
            />
            <Button size={'icon'} className='absolute right-4 bottom-4' onClick={() => onSend()}>
              <Send className='h-6 w-6' />
            </Button>
          </div>
        </div>

        {/* Suggestion Section in Horizontal Row */}
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary  hover:text-white">
              {suggestion.icon}
              <span className="text-md">{suggestion.title}</span>
            </div>
          ))}
        </div>

       <h2 className="my-7 mt-14 flex justify-center items-center gap-2 text-center w-full">
  Not sure where to start?
  <strong>see how it works</strong>
  <ArrowDown />
</h2>



        <HeroVideoDialog
  className="block dark:hidden"
  animationStyle="from-center"
  videoSrc="https://www.example.com/dummy-video"
  thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
  thumbnailAlt="Dummy Video Thumbnail"
/>
      </div>
    </div>
  );
}
