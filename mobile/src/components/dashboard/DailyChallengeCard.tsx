import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyChallenge } from '../../services/dashboardService';

interface DailyChallengeCardProps {
  dailyChallenge: DailyChallenge | null;
  onPress?: (challengeId: string) => void;
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ dailyChallenge, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#8B5FBF';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'checkmark-circle';
      case 'medium': return 'warning';
      case 'hard': return 'flame';
      default: return 'code';
    }
  };

  if (!dailyChallenge) {
    return (
      <TouchableOpacity style={[styles.container, styles.emptyContainer]}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="code-slash-outline" size={40} color="#8B5FBF" />
        </View>
        <Text style={styles.emptyTitle}>No Challenge Today</Text>
        <Text style={styles.emptySubtitle}>Check back tomorrow for a new coding challenge!</Text>
      </TouchableOpacity>
    );
  }

  const { status } = dailyChallenge;
  const isCompleted = status.completed;
  const isAttempted = status.attempted;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress && onPress(dailyChallenge._id)}
    >
      <LinearGradient
        colors={isCompleted 
          ? ['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.05)']
          : ['rgba(139, 95, 191, 0.1)', 'rgba(139, 95, 191, 0.05)']
        }
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daily Challenge</Text>
          <View style={[styles.statusBadge, isCompleted && styles.completedBadge]}>
            <Ionicons 
              name={isCompleted ? "checkmark" : isAttempted ? "hourglass" : "flash"} 
              size={16} 
              color={isCompleted ? "#4CAF50" : "#8B5FBF"} 
            />
          </View>
        </View>

        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle} numberOfLines={2}>
            {dailyChallenge.title}
          </Text>
          <Text style={styles.challengeDescription} numberOfLines={3}>
            {dailyChallenge.description}
          </Text>
        </View>

        <View style={styles.metaInfo}>
          <View style={styles.difficultyContainer}>
            <Ionicons 
              name={getDifficultyIcon(dailyChallenge.difficulty)} 
              size={14} 
              color={getDifficultyColor(dailyChallenge.difficulty)} 
            />
            <Text style={[styles.difficulty, { color: getDifficultyColor(dailyChallenge.difficulty) }]}>
              {dailyChallenge.difficulty.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.categoryContainer}>
            <Ionicons name="folder-outline" size={14} color="#888" />
            <Text style={styles.category}>{dailyChallenge.category}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.points}>
              {isCompleted ? status.pointsEarned : dailyChallenge.points} pts
            </Text>
          </View>
          
          <View style={styles.actionButton}>
            {isCompleted ? (
              <>
                <Ionicons name="trophy" size={16} color="#4CAF50" />
                <Text style={[styles.actionText, { color: '#4CAF50' }]}>Completed!</Text>
              </>
            ) : isAttempted ? (
              <>
                <Ionicons name="refresh" size={16} color="#FF9800" />
                <Text style={[styles.actionText, { color: '#FF9800' }]}>Try Again</Text>
              </>
            ) : (
              <>
                <Ionicons name="play" size={16} color="#8B5FBF" />
                <Text style={styles.actionText}>Start Challenge</Text>
              </>
            )}
          </View>
        </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  challengeInfo: {
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 18,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 11,
    color: '#888',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5FBF',
    marginLeft: 6,
  },
  // Empty state styles
  emptyContainer: {
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default DailyChallengeCard;
