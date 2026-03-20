"use client";
import { Compass } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignInButton, useUser } from '@clerk/nextjs';

const menuOptions = [
  { name: 'Home', path: '/' },
  { name: 'Contact Us', path: '/contact-us' },
];

function Header() {
  const{user} = useUser();


  
  return (
    <div className='relative flex justify-between items-center p-4 bg-linear-to-r from-white to-blue-50 border-b border-blue-100 shadow-sm'>
      <div className="flex gap-2 items-center cursor-pointer">
        <div className="p-2 bg-linear-to-br from-blue-600 to-teal-600 rounded-lg">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-bold text-2xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tripli</h1>
      </div>

      {/* Centered nav links */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-4">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className="cursor-pointer hover:underline hover:scale-105 transition-all hover:text-primary">{menu.name}</h2>
          </Link>
        ))}
      </div>

      <div>
        {!user ? (
          <SignInButton mode='modal'>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24"><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C35.64 2.34 30.13 0 24 0 14.61 0 6.44 5.74 2.44 14.09l8.06 6.27C12.44 13.09 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.54-.14-3.03-.39-4.47H24v8.47h12.44c-.54 2.91-2.18 5.38-4.64 7.04l7.19 5.59C43.56 37.09 46.1 31.27 46.1 24.5z"/><path fill="#FBBC05" d="M10.5 28.36c-.54-1.62-.85-3.34-.85-5.36s.31-3.74.85-5.36l-8.06-6.27C1.09 15.91 0 19.81 0 24c0 4.19 1.09 8.09 2.44 11.63l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.02 15.83-5.5l-7.19-5.59c-2.01 1.35-4.59 2.15-7.64 2.15-6.26 0-11.56-3.59-13.5-8.86l-8.06 6.27C6.44 42.26 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
              Sign in with Google
            </Button>
          </SignInButton>
        ) : (
          <Link href={'/create-new-trip'}>
            <Button>Create New Trip</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header;
