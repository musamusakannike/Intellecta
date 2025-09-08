import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CurrentProgress, LeaderboardData } from '../../services/dashboardService';

interface ProgressTrackerProps {
  currentProgress: CurrentProgress | null;
  leaderboard: LeaderboardData;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentProgress, leaderboard }) => {
  const progress = currentProgress?.progressPercentage || 0;

  return (
    <View style={styles.container}>
      <View style={styles.progressRing}>
        {/* Background ring */}
        <View style={styles.progressBackground} />
        
        {/* Progress indicator using multiple segments for visual effect */}
        <View style={styles.progressSegments}>
          {[...Array(20)].map((_, index) => {
            const segmentProgress = (index + 1) * 5; // Each segment represents 5%
            const isActive = segmentProgress <= progress;
            return (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  {
                    transform: [{ rotate: `${index * 18}deg` }], // 360/20 = 18 degrees per segment
                    backgroundColor: isActive ? '#8B5FBF' : 'rgba(139, 95, 191, 0.1)',
                  },
                ]}
              />
            );
          })}
        </View>
        
        {/* Center content */}
        <View style={styles.centerContent}>
          <View style={styles.codeIconContainer}>
            <Ionicons name="code" size={28} color="#8B5FBF" />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Rank</Text>
            <Text style={styles.statValue}>
              {leaderboard.userRank > 0 ? `#${leaderboard.userRank}` : '-'}
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="star" size={16} color="#8B5FBF" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{leaderboard.userLevel}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="flame" size={16} color="#FF6B47" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{leaderboard.streakDays} days</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Ionicons name="diamond" size={16} color="#06B6D4" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={styles.statValue}>{leaderboard.userPoints}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  progressRing: {
    position: 'relative',
    width: 120,
    height: 120,
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: 'rgba(139, 95, 191, 0.1)',
  },
  progressSegments: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  progressSegment: {
    position: 'absolute',
    width: 4,
    height: 12,
    top: 2,
    left: 58,
    borderRadius: 2,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  codeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProgressTracker;
