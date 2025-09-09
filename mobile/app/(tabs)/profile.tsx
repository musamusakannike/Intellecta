import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import ProfileCard from '../../src/components/profile/ProfileCard';
import ProfileTabs from '../../src/components/profile/ProfileTabs';
import AchievementsTab from '../../src/components/profile/AchievementsTab';
import CertificatesTab from '../../src/components/profile/CertificatesTab';
import SettingsTab from '../../src/components/profile/SettingsTab';
import profileService, { ProfileData } from '../../src/services/profileService';

type TabType = 'achievements' | 'certificates' | 'settings';

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('achievements');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const data = await profileService.getProfileData();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to load profile data:', error);
      Alert.alert(
        'Error',
        'Failed to load profile data. Please check your connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      await updateUser(updatedData);
      await loadProfileData();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const renderActiveTab = () => {
    if (!profileData) return null;

    switch (activeTab) {
      case 'achievements':
        return <AchievementsTab achievements={profileData.achievements} />;
      case 'certificates':
        return <CertificatesTab certificates={profileData.certificates} />;
      case 'settings':
        return (
          <SettingsTab
            user={user}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      data={[1]} // dummy data to enable FlatList rendering
      keyExtractor={(item) => String(item)}
      renderItem={() => null}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <ProfileCard
            user={user}
            stats={profileData.stats}
            level={profileData.level}
            onUpdateProfile={handleUpdateProfile}
          />

          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <View style={styles.tabContent}>
            {renderActiveTab()}
          </View>
        </>
      }
      ListFooterComponent={<View style={styles.bottomPadding} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomPadding: {
    height: 20,
  },
});
