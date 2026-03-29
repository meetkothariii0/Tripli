"use client";

import React, { use, useContext, useEffect, useState } from 'react';
import Header from './_components/Header';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();

  const createUser = useMutation(api.user.CreateNewUser);

  const[userDetail, setUserDetail]=useState<any>();

  const existingUser = useQuery(api.user.getUserByEmail, {
    email: user?.primaryEmailAddress?.emailAddress || '',
  });

  useEffect(() => {
    if (user && existingUser === null) {
      createUser({
        email: user.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user.imageUrl,
        name: user.fullName ?? '',
        subscription: 'free',
      });
    }
  }, [user, existingUser, createUser]);

  // Update userDetail with the existing user (from Convex) when it loads
  useEffect(() => {
    if (existingUser) {
      console.log('Provider - User from Convex:', existingUser);
      setUserDetail(existingUser);
    }
  }, [existingUser]);

  return (
    <UserDetailContext.Provider value={{user: userDetail, setUserDetail}}>
    <div>
      <Header />
      {children}
    </div>
        </UserDetailContext.Provider>

  );
}

export default Provider;

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}


