"use client";

import { auth } from '@/configs/firebaseConfig';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import React from 'react';
import { useAuthContext } from '../provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function ProfileAvatar() {
    const user = useAuthContext();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger>
                {user?.user?.photoURL ? (
                    <Image 
                        src={user.user.photoURL} 
                        alt="Profile" 
                        width={35} 
                        height={35} 
                        className="rounded-full cursor-pointer" 
                    />
                ) : (
                    <div className="w-[35px] h-[35px] rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm text-gray-600">?</span>
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-[120px] max-w-sm">
                <Button variant="ghost" onClick={handleLogout} className="w-full">
                    Logout
                </Button>
            </PopoverContent>
        </Popover>
    );
}

export default ProfileAvatar;
