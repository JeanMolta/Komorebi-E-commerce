import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setCurrentUser, clearCurrentUser } from '../store/slices/authSlice';
import { loadCartFromSupabase, clearCartState } from '../store/slices/cartSlice';
import { loadFavorites, clearFavoritesState } from '../store/slices/favoritesSlice';
import { supabase } from '../lib/supabaseClient';
import { initializeCategories } from '../utils/categories';
import { initializeStorage } from '../utils/imageUpload';
import { testSupabaseConnection } from '../utils/testConnection';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Load user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              dispatch(setCurrentUser({
                id: profile.id,
                email: session.user.email || '',
                firstName: profile.first_name,
                lastName: profile.last_name,
                avatarUrl: profile.avatar_url,
                address: profile.address,
                phone: profile.phone,
                preferredLanguage: profile.preferred_language,
                preferredCurrency: profile.preferred_currency,
                biography: profile.biography
              }));

              // Load user's cart and favorites
              dispatch(loadCartFromSupabase(session.user.id));
              dispatch(loadFavorites(session.user.id));
            }
          });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Load user profile
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                dispatch(setCurrentUser({
                  id: profile.id,
                  email: session.user.email || '',
                  firstName: profile.first_name,
                  lastName: profile.last_name,
                  avatarUrl: profile.avatar_url,
                  address: profile.address,
                  phone: profile.phone,
                  preferredLanguage: profile.preferred_language,
                  preferredCurrency: profile.preferred_currency,
                  biography: profile.biography
                }));

                // Load user's cart and favorites
                dispatch(loadCartFromSupabase(session.user.id));
                dispatch(loadFavorites(session.user.id));
              }
            });
        } else if (event === 'SIGNED_OUT') {
          dispatch(clearCurrentUser());
          dispatch(clearCartState());
          dispatch(clearFavoritesState());
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Initialize categories and storage on app startup
  useEffect(() => {
    // Test connection but don't let it block the app
    testSupabaseConnection().catch(console.error);
    initializeCategories();
    
    // Initialize storage with better error handling
    initializeStorage().then(() => {
      console.log('✅ Storage system ready');
    }).catch((error) => {
      console.error('⚠️ Storage initialization failed:', error);
    });
  }, []);

  return <>{children}</>;
};

export default AuthProvider;