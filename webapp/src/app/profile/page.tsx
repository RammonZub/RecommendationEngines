'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './profile.module.css';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router, loading]);

  if (loading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1 className={styles.title}>Your Profile</h1>
        
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {user.name.charAt(0)}
            </div>
          </div>
          
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Your Preferences</h3>
          <div className={styles.preferences}>
            <div className={styles.preferenceGroup}>
              <h4 className={styles.preferenceTitle}>Favorite Cuisines</h4>
              <div className={styles.tagContainer}>
                {user.preferences?.favoriteCuisines.map((cuisine, index) => (
                  <span key={index} className={styles.tag}>{cuisine}</span>
                ))}
              </div>
            </div>
            
            <div className={styles.preferenceGroup}>
              <h4 className={styles.preferenceTitle}>Favorite Neighborhoods</h4>
              <div className={styles.tagContainer}>
                {user.preferences?.favoriteNeighborhoods.map((neighborhood, index) => (
                  <span key={index} className={styles.tag}>{neighborhood}</span>
                ))}
              </div>
            </div>
            
            <div className={styles.preferenceGroup}>
              <h4 className={styles.preferenceTitle}>Price Range</h4>
              <span className={styles.priceTag}>{user.preferences?.priceRange || '€€'}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.logoutButton}
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 