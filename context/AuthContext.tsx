import { createContext } from "react";
import type { User } from "@supabase/supabase-js"; 

export interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
