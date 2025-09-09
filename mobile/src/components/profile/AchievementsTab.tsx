import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Achievement } from '../../services/profileService';

interface AchievementsTabProps {
  achievements: Achievement[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  const getRarityColor = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
      case 'common': return '#6B7280';
      case 'rare': return '#06B6D4';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#FFD700';
      default: return '#6B7280';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
      case 'common': return 'rgba(107, 114, 128, 0.3)';
      case 'rare': return 'rgba(6, 182, 212, 0.3)';
      case 'epic': return 'rgba(139, 92, 246, 0.3)';
      case 'legendary': return 'rgba(255, 215, 0, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  };

  const getIconName = (icon: string): string => {
    const iconMap: { [key: string]: string } = {
      footsteps: 'footsteps-outline',
      flame: 'flame',
      trophy: 'trophy',
      moon: 'moon',
      star: 'star',
    };
    return iconMap[icon] || 'trophy-outline';
  };

  const renderAchievement = ({ item }: { item: Achievement }) => {
    const rarityColor = getRarityColor(item.rarity);
    const rarityGlow = getRarityGlow(item.rarity);
    
    return (
      <TouchableOpacity 
        style={[
          styles.achievementCard, 
          item.isUnlocked && { 
            borderColor: rarityColor,
            shadowColor: rarityColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
          },
          !item.isUnlocked && styles.lockedCard,
        ]}
        disabled={!item.isUnlocked}
      >
        <View style={styles.achievementHeader}>
          <View style={[
            styles.iconContainer,
            { 
              backgroundColor: item.isUnlocked ? rarityGlow : 'rgba(139, 95, 191, 0.1)',
            }
          ]}>
            <Ionicons 
              name={getIconName(item.icon) as any}
              size={24} 
              color={item.isUnlocked ? rarityColor : '#666'} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[
              styles.achievementTitle, 
              !item.isUnlocked && styles.lockedText
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.rarityBadge,
              { color: item.isUnlocked ? rarityColor : '#666' }
            ]}>
              {item.rarity.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={[
          styles.achievementDescription,
          !item.isUnlocked && styles.lockedText
        ]}>
          {item.description}
        </Text>
        
        {!item.isUnlocked && item.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${item.progress}%`, backgroundColor: '#8B5FBF' }
              ]} />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
        
        {!item.isUnlocked && item.requirement && (
          <Text style={styles.requirement}>{item.requirement}</Text>
        )}
        
        {item.isUnlocked && item.unlockedAt && (
          <Text style={styles.unlockedDate}>
            Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <View style={styles.container}>
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unlockedAchievements.length}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{achievements.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      <FlatList
        data={[...unlockedAchievements, ...lockedAchievements]}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  achievementCard: {
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  lockedCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rarityBadge: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  lockedText: {
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    minWidth: 30,
  },
  requirement: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  unlockedDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});

export default AchievementsTab;
