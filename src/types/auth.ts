// src/types/auth.ts
import type { UserRole } from "./common";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
  }
  