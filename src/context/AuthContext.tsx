// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { AuthSession, User } from '@supabase/supabase-js';

interface AuthContextProps {
    user: User | null;
    session: AuthSession | null;
    loading: boolean;
}

const initialState: AuthContextProps = {
    user: null,
    session: null,
    loading: true
};

export const AuthContext = createContext<AuthContextProps>(initialState);

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<AuthSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to recover session from storage
        const initializeAuth = async () => {
            try {
                // Get current session
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();
                
                console.log('Retrieved session:', {
                    hasSession: !!currentSession,
                    error: error?.message
                });

                if (currentSession) {
                    setSession(currentSession);
                    setUser(currentSession.user);
                }
            } catch (error) {
                console.error('Session retrieval error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log('Auth state change:', { event, hasSession: !!newSession });
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const contextValue = {
        user,
        session,
        loading
    };

    if (loading) {
        return <div>Loading auth state...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
