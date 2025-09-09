import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileStats, UserLevel } from '../../services/profileService';

interface ProfileCardProps {
  user: { name: string; email: string; avatar?: string } | null;
  stats: ProfileStats;
  level: UserLevel;
  onUpdateProfile?: (data: Partial<{ name: string; email: string }>) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, stats, level, onUpdateProfile }) => {
  const ringColor = level.color || '#8B5FBF';

  return (
    <View style={styles.container}>
      <View style={[styles.avatarRing, { shadowColor: ringColor, borderColor: ringColor }]}>        
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color={ringColor} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.levelRow}>
          <View style={[styles.levelBadge, { borderColor: ringColor }]}>            
            <Ionicons name="star" size={14} color={ringColor} />
            <Text style={[styles.levelText, { color: ringColor }]}>Lv {level.current} · {level.name}</Text>
          </View>
          <View style={styles.xpBarBackground}>
            <View style={[styles.xpBarFill, { width: `${level.progress}%`, backgroundColor: ringColor }]} />
          </View>
          <Text style={styles.xpText}>{level.xpCurrent}/{level.xpRequired} XP</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.xp}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completedCourses}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.streakDays}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  levelRow: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  xpBarBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 10,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpText: {
    marginTop: 6,
    color: '#888',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
});

export default ProfileCard;

