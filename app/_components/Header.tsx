"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, useUser } from '@clerk/nextjs';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { tripStore } from '@/lib/tripStore';

function Header() {
  const { user } = useUser();
  const [tripCount, setTripCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setTripCount(tripStore.list().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    // Poll lightly for index changes across tabs/modifications
    const interval = setInterval(updateCount, 1500);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='relative flex justify-between items-center p-4 bg-linear-to-r from-white to-blue-50 border-b border-blue-100 shadow-sm'>
      <Link href="/" className="flex gap-2 items-center cursor-pointer">
        <div className="p-2 bg-linear-to-br from-blue-600 to-teal-600 rounded-lg">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tripli</h1>
      </Link>

      {/* Centered nav links */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 items-center">
        <Link href="/">
          <h2 className="cursor-pointer hover:underline hover:scale-105 transition-all text-sm font-semibold hover:text-primary">Home</h2>
        </Link>
        <Link href="/contact-us">
          <h2 className="cursor-pointer hover:underline hover:scale-105 transition-all text-sm font-semibold hover:text-primary">Contact Us</h2>
        </Link>
        <Link href="/trips" className="flex items-center gap-1.5 group">
          <Luggage className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
          <span className="text-sm font-semibold group-hover:text-primary transition-colors">My Trips</span>
          <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
            {tripCount}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/trips" className="md:hidden">
          <Button variant="outline" size="sm" className="text-xs gap-1.5">
            <Luggage className="w-3.5 h-3.5" />
            <span>{tripCount}</span>
          </Button>
        </Link>
        <SettingsDrawer />
        {!user ? (
          <SignInButton mode='modal'>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C35.64 2.34 30.13 0 24 0 14.61 0 6.44 5.74 2.44 14.09l8.06 6.27C12.44 13.09 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.54-.14-3.03-.39-4.47H24v8.47h12.44c-.54 2.91-2.18 5.38-4.64 7.04l7.19 5.59C43.56 37.09 46.1 31.27 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.36c-.54-1.62-.85-3.34-.85-5.36s.31-3.74.85-5.36l-8.06-6.27C1.09 15.91 0 19.81 0 24c0 4.19 1.09 8.09 2.44 11.63l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.02 15.83-5.5l-7.19-5.59c-2.01 1.35-4.59 2.15-7.64 2.15-6.26 0-11.56-3.59-13.5-8.86l-8.06 6.27C6.44 42.26 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
              Sign in
            </Button>
          </SignInButton>
        ) : (
          <Link href={'/create-new-trip'}>
            <Button>Create Trip</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
