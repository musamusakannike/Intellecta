import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react-native';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, typography, borderRadius } from '../../src/constants';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.lg * 2;

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCardPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // router.push(route);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[400]}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}! 👋</Text>
            <Text style={styles.subtitle}>Ready to code today?</Text>
          </View>
          
          {user?.isPremium && (
            <View style={styles.premiumBadge}>
              <Sparkles size={16} color={colors.secondary[400]} strokeWidth={2.5} />
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <TrendingUp size={24} color={colors.primary[400]} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(217, 70, 239, 0.15)' }]}>
              <Clock size={24} color={colors.secondary[400]} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>0h</Text>
            <Text style={styles.statLabel}>Learning Time</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
              <Award size={24} color={colors.success.main} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </Animated.View>

        {/* Continue Learning */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity onPress={() => handleCardPress('/courses')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <BookOpen size={48} color={colors.text.tertiary} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptyDescription}>
              Start your coding journey by enrolling in a course
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => handleCardPress('/courses')}
            >
              <Text style={styles.emptyButtonText}>Browse Courses</Text>
              <ChevronRight size={20} color={colors.primary[400]} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Featured Courses */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Zap size={24} color={colors.primary[400]} strokeWidth={2.5} />
              <Text style={styles.sectionTitle}>Featured Courses</Text>
            </View>
            <TouchableOpacity onPress={() => handleCardPress('/courses')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {[1, 2, 3].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.courseCard}
                onPress={() => handleCardPress(`/courses/${item}`)}
              >
                <Image
                  source={{ uri: 'https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Course' }}
                  style={styles.courseImage}
                  contentFit="cover"
                />
                <View style={styles.courseContent}>
                  <View style={styles.courseTag}>
                    <Text style={styles.courseTagText}>JavaScript</Text>
                  </View>
                  <Text style={styles.courseTitle}>JavaScript Fundamentals</Text>
                  <Text style={styles.courseDescription}>
                    Master the basics of JavaScript programming
                  </Text>
                  <View style={styles.courseFooter}>
                    <View style={styles.courseRating}>
                      <Text style={styles.courseRatingText}>⭐ 4.8</Text>
                    </View>
                    <Text style={styles.courseStudents}>1.2k students</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => handleCardPress('/community')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <MessageCircle size={24} color={colors.primary[400]} strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionText}>Ask Question</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => handleCardPress('/projects')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(217, 70, 239, 0.15)' }]}>
                <FolderKanban size={24} color={colors.secondary[400]} strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionText}>My Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => handleCardPress('/profile')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <Award size={24} color={colors.success.main} strokeWidth={2.5} />
              </View>
              <Text style={styles.quickActionText}>Achievements</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Import missing icons
import { BookOpen, MessageCircle, FolderKanban } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.sizes['3xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.elevated,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.secondary[500],
  },
  premiumText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.secondary[400],
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface.base,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.main,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.medium,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
  },
  seeAll: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.primary[400],
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.elevated,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  emptyButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: colors.primary[400],
  },
  horizontalScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  courseCard: {
    width: CARD_WIDTH * 0.75,
    backgroundColor: colors.surface.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.main,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.surface.elevated,
  },
  courseContent: {
    padding: spacing.md,
  },
  courseTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  courseTagText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.semiBold,
    color: colors.primary[400],
  },
  courseTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  courseDescription: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseRatingText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.text.primary,
  },
  courseStudents: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.tertiary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
