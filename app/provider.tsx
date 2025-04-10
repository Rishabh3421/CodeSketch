"use client";
import { auth, db } from "@/configs/firebaseConfig";
import { AuthContext } from "@/context/AuthContext";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";

// Check available properties
// const myError: StorageError = {} as any; 
// console.log(myError);

// Define a local AuthContextType that matches what's in context/AuthContext.tsx
interface LocalAuthContextType {
  user: FirebaseUser | null;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function Provider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Check if we already have a cached image to avoid refetching
        const cachedImage = localStorage.getItem(`profile_${user.uid}`);
        if (cachedImage) {
          await storeUserInFirestore(user, cachedImage);
          return;
        }

        // Try uploading profile image
        const imageUrl = await uploadToSupabase(user.photoURL);
        if (imageUrl) {
          localStorage.setItem(`profile_${user.uid}`, imageUrl);
        }
        await storeUserInFirestore(user, imageUrl);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to upload profile image to Supabase with exponential backoff
  const uploadToSupabase = async (photoURL: string | null) => {
    if (!photoURL) return null;
  
    try {
      const fileName = `profile_${Date.now()}.jpg`;
  
      // Retry logic for fetching profile image
      let attempt = 0;
      let response;
      while (attempt < 3) {
        response = await fetch(photoURL);
        if (response.ok) break;
  
        if (response.status === 429) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`Google blocked request, retrying after ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
          attempt++;
        } else {
          console.error("Fetching image failed:", response.status);
          return null;
        }
      }
  
      if (!response || !response.ok) return null;
  
      const blob = await response.blob();
  
      attempt = 0;
      while (attempt < 3) {
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, blob, { contentType: "image/jpeg" });
  
        if (!error) {
          return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
        }
  
        // Check for rate limiting using error.name instead of error.status
        if (error.name === "429") {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
          console.warn(`Supabase rate limit, retrying after ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
          attempt++;
        } else {
          console.error("Supabase upload failed:", error.message);
          return null;
        }
      }
  
      return null;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };
  
  // Function to store user in Firestore
  const storeUserInFirestore = async (user: FirebaseUser, imageUrl: string | null) => {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "Anonymous",
          email: user.email || "No email",
          profileImage: imageUrl || "/default-avatar.png", 
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log("User added to Firestore ✅");
    } catch (error) {
      console.error("Error storing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user }as any}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export const useAuthContext = (): LocalAuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context as LocalAuthContextType;
};

export default Provider;
