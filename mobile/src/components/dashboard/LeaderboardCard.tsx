import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LeaderboardData } from '../../services/dashboardService';

interface LeaderboardCardProps {
  leaderboard: LeaderboardData;
  onPress?: () => void;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ leaderboard, onPress }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getLevelColor = (level: number) => {
    if (level <= 5) return '#4CAF50';
    if (level <= 15) return '#FF9800';
    if (level <= 30) return '#8B5FBF';
    return '#F44336';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={['rgba(139, 95, 191, 0.1)', 'rgba(139, 95, 191, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Ionicons name="trophy" size={24} color="#FFD700" />
        </View>

        {/* User's Position */}
        <View style={styles.userSection}>
          <View style={styles.userRank}>
            <Text style={styles.userRankText}>
              {leaderboard.userRank > 0 ? `#${leaderboard.userRank}` : 'Unranked'}
            </Text>
            <View style={styles.userLevelBadge}>
              <Text style={[styles.levelText, { color: getLevelColor(leaderboard.userLevel) }]}>
                Lv.{leaderboard.userLevel}
              </Text>
            </View>
          </View>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.statValue}>{leaderboard.userPoints}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={14} color="#FF6B47" />
              <Text style={styles.statValue}>{leaderboard.streakDays}</Text>
            </View>
          </View>
        </View>

        {/* Top Users */}
        <View style={styles.topUsersSection}>
          <Text style={styles.topUsersTitle}>Top Performers</Text>
          {leaderboard.topUsers.slice(0, 3).map((user, index) => (
            <View key={user.rank} style={styles.topUserItem}>
              <View style={styles.topUserLeft}>
                <Text style={styles.rankEmoji}>{getRankIcon(user.rank)}</Text>
                {user.profilePicture?.url ? (
                  <Image source={{ uri: user.profilePicture.url }} style={styles.topUserAvatar} />
                ) : (
                  <View style={styles.topUserAvatarPlaceholder}>
                    <Text style={styles.topUserInitial}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.topUserInfo}>
                  <Text style={styles.topUserName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={styles.topUserLevel}>
                    Level {user.level}
                  </Text>
                </View>
              </View>
              <Text style={styles.topUserPoints}>{user.points}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
          <Text style={styles.viewAllText}>View Full Leaderboard</Text>
          <Ionicons name="chevron-forward" size={16} color="#8B5FBF" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B5FBF',
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  userRank: {
    alignItems: 'center',
  },
  userRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userLevelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  userStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topUsersSection: {
    marginBottom: 12,
  },
  topUsersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 12,
  },
  topUserItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  topUserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankEmoji: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  topUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  topUserAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 95, 191, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topUserInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topUserInfo: {
    flex: 1,
  },
  topUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  topUserLevel: {
    fontSize: 11,
    color: '#888',
  },
  topUserPoints: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5FBF',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5FBF',
    marginRight: 4,
  },
});

export default LeaderboardCard;
