import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { router } from 'expo-router';
import DashboardHeader from '../../src/components/dashboard/DashboardHeader';
import ProgressTracker from '../../src/components/dashboard/ProgressTracker';
import ContinueLessonCard from '../../src/components/dashboard/ContinueLessonCard';
import DailyChallengeCard from '../../src/components/dashboard/DailyChallengeCard';
import LeaderboardCard from '../../src/components/dashboard/LeaderboardCard';
import CommunityPicksCard from '../../src/components/dashboard/CommunityPicksCard';
import dashboardService, { DashboardData } from '../../src/services/dashboardService';

export default function HomeScreen() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardOverview();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert(
        'Error',
        'Failed to load dashboard data. Please check your connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleContinueLesson = () => {
    // Navigate to course or lesson
    router.push('/courses');
  };

  const handleChallengePress = (challengeId: string) => {
    // Navigate to challenge details
    console.log('Challenge pressed:', challengeId);
  };

  const handleLeaderboardPress = () => {
    // Navigate to full leaderboard
    console.log('Leaderboard pressed');
  };

  const handleCoursePress = (courseId: string) => {
    // Navigate to course details
    console.log('Course pressed:', courseId);
  };

  const handleViewAllCourses = () => {
    router.push('/courses');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load dashboard</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#8B5FBF"
          colors={['#8B5FBF']}
        />
      }
    >
      <DashboardHeader 
        user={dashboardData.user} 
        onProfilePress={handleProfilePress}
      />
      
      <ProgressTracker 
        currentProgress={dashboardData.currentProgress}
        leaderboard={dashboardData.leaderboard}
      />

      <View style={styles.cardsContainer}>
        <View style={styles.cardRow}>
          <View style={styles.cardHalf}>
            <ContinueLessonCard 
              currentProgress={dashboardData.currentProgress}
              onPress={handleContinueLesson}
            />
          </View>
          <View style={styles.cardHalf}>
            <DailyChallengeCard 
              dailyChallenge={dashboardData.dailyChallenge}
              onPress={handleChallengePress}
            />
          </View>
        </View>

        <View style={styles.fullWidthCard}>
          <LeaderboardCard 
            leaderboard={dashboardData.leaderboard}
            onPress={handleLeaderboardPress}
          />
        </View>
      </View>

      <CommunityPicksCard 
        communityPicks={dashboardData.communityPicks}
        onCoursePress={handleCoursePress}
        onViewAllPress={handleViewAllCourses}
      />
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  scrollContent: {
    paddingBottom: 20,
    gap: 20
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
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
  cardsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHalf: {
    flex: 0.48,
  },
  fullWidthCard: {
    width: '100%',
    marginBottom: 16,
  },
  bottomPadding: {
    height: 20,
  },
});
