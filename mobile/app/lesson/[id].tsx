import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import lessonsService, { 
  Lesson, 
  LessonContent, 
  LessonContentGroup,
  QuizSubmissionResponse 
} from '../../src/services/lessonsService';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LessonDetailScreen() {
  const { id: lessonId } = useLocalSearchParams<{ id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizSubmissionResponse | null>(null);
  const [progressUpdating, setProgressUpdating] = useState(false);
  const [lessonStartTime] = useState(Date.now());

  useEffect(() => {
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const lessonData = await lessonsService.getLessonById(lessonId!);
      console.log("Lesson data:", JSON.stringify(lessonData, null, 2));
      setLesson(lessonData);
      
      // Initialize quiz answers
      if (lessonData.quiz) {
        setQuizAnswers(new Array(lessonData.quiz.length).fill(-1));
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
      Alert.alert('Error', 'Failed to load lesson. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLesson();
  };

  const markLessonAsComplete = async () => {
    if (!lesson || !lesson.isEnrolled) return;

    try {
      setProgressUpdating(true);
      const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000 / 60); // minutes
      
      await lessonsService.markLessonProgress(lessonId!, true, timeSpent);
      
      // Update local state
      setLesson(prev => prev ? {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          lesson: lessonId!,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          timeSpent: (prev.userProgress?.timeSpent || 0) + timeSpent,
          quizScore: prev.userProgress?.quizScore,
        }
      } : prev);

      Alert.alert('Success', 'Lesson marked as complete!');
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
      Alert.alert('Error', 'Failed to update progress. Please try again.');
    } finally {
      setProgressUpdating(false);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    if (!lesson || !lesson.quiz) return;

    // Check if all questions are answered
    if (quizAnswers.includes(-1)) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }

    try {
      const results = await lessonsService.submitQuiz(lessonId!, quizAnswers);
      setQuizResults(results);
      setQuizSubmitted(true);

      // Update lesson progress with quiz score
      setLesson(prev => prev ? {
        ...prev,
        userProgress: {
          ...prev.userProgress!,
          quizScore: results.score,
          isCompleted: results.passed,
          completedAt: results.passed ? new Date().toISOString() : prev.userProgress?.completedAt,
        }
      } : prev);

      Alert.alert(
        results.passed ? 'Quiz Passed!' : 'Quiz Failed',
        `You scored ${results.score}% (${results.correctAnswers}/${results.totalQuestions} correct)`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz. Please try again.');
    }
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <Text key={content.order} style={styles.contentText}>
            {content.content}
          </Text>
        );
      
      case 'code':
        return (
          <View key={content.order} style={styles.codeBlock}>
            <Text style={styles.codeText}>{content.content}</Text>
          </View>
        );
      
      case 'link':
        return (
          <TouchableOpacity key={content.order} style={styles.linkContainer}>
            <Ionicons name="link" size={16} color="#8B5FBF" />
            <Text style={styles.linkText}>{content.content}</Text>
          </TouchableOpacity>
        );
      
      default:
        return (
          <View key={content.order} style={styles.unsupportedContent}>
            <Text style={styles.unsupportedText}>
              {content.type} content (not yet supported)
            </Text>
          </View>
        );
    }
  };

  const renderContentGroup = (group: LessonContentGroup) => (
    <View key={group.order} style={styles.contentGroup}>
      <Text style={styles.contentGroupTitle}>{group.title}</Text>
      {group.description && (
        <Text style={styles.contentGroupDescription}>{group.description}</Text>
      )}
      {group.contents
        .sort((a, b) => a.order - b.order)
        .map(content => renderContent(content))}
    </View>
  );

  const renderQuizModal = () => {
    if (!lesson?.quiz) return null;

    return (
      <Modal
        visible={showQuiz}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQuiz(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowQuiz(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Quiz</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.quizContainer}>
            {lesson.quiz.map((question, questionIndex) => (
              <View key={questionIndex} style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {questionIndex + 1}. {question.question}
                </Text>
                
                {question.options.map((option, optionIndex) => {
                  const isSelected = quizAnswers[questionIndex] === optionIndex;
                  const isCorrect = quizSubmitted && optionIndex === question.correctAnswer;
                  const isWrong = quizSubmitted && isSelected && optionIndex !== question.correctAnswer;
                  
                  return (
                    <TouchableOpacity
                      key={optionIndex}
                      style={[
                        styles.optionButton,
                        isSelected && !quizSubmitted && styles.selectedOption,
                        isCorrect && quizSubmitted && styles.correctOption,
                        isWrong && styles.wrongOption,
                      ]}
                      onPress={() => !quizSubmitted && handleQuizAnswer(questionIndex, optionIndex)}
                      disabled={quizSubmitted}
                    >
                      <Text style={[
                        styles.optionText,
                        (isSelected || isCorrect) && styles.selectedOptionText,
                      ]}>
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {quizSubmitted && question.explanation && (
                  <View style={styles.explanationContainer}>
                    <Text style={styles.explanationText}>{question.explanation}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {!quizSubmitted && (
            <View style={styles.quizFooter}>
              <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
                <LinearGradient
                  colors={['#8B5FBF', '#D946EF']}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>Submit Quiz</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5FBF" />
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Lesson Not Found</Text>
        <Text style={styles.errorText}>
          The lesson you&apos;re looking for doesn&apos;t exist or has been removed.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompleted = lesson.userProgress?.isCompleted || false;
  const hasQuiz = lesson.hasQuiz || false;
  const canTakeQuiz = lesson.isEnrolled && hasQuiz;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <View style={styles.headerActions}>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
          )}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
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
        {/* Lesson Info */}
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
          
          {lesson.topic && (
            <View style={styles.breadcrumb}>
              <Text style={styles.breadcrumbText}>
                {lesson.topic.course.title} → {lesson.topic.title}
              </Text>
            </View>
          )}
        </View>

        {/* Progress Stats */}
        {lesson.userProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressStats}>
              {lesson.userProgress.timeSpent > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="#8B5FBF" />
                  <Text style={styles.statText}>
                    {Math.round(lesson.userProgress.timeSpent)}m spent
                  </Text>
                </View>
              )}
              
              {lesson.userProgress.quizScore !== undefined && lesson.userProgress.quizScore !== null && (
                <View style={styles.statItem}>
                  <Ionicons name="trophy-outline" size={16} color={lesson.userProgress.quizScore >= 70 ? '#4CAF50' : '#FF9800'} />
                  <Text style={[styles.statText, { color: lesson.userProgress.quizScore >= 70 ? '#4CAF50' : '#FF9800' }]}>
                    Quiz: {lesson.userProgress.quizScore}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Lesson Content */}
        <View style={styles.contentContainer}>
          {lesson.contentGroups && lesson.contentGroups.length > 0 ? (
            lesson.contentGroups
              .sort((a, b) => a.order - b.order)
              .map(group => renderContentGroup(group))
          ) : (
            <View style={styles.noContentContainer}>
              <Ionicons name="document-text-outline" size={48} color="#666" />
              <Text style={styles.noContentText}>No content available for this lesson yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {lesson.isEnrolled && (
        <View style={styles.actionsContainer}>
          {canTakeQuiz && (
            <TouchableOpacity
              style={[styles.actionButton, styles.quizButton]}
              onPress={() => setShowQuiz(true)}
            >
              <Ionicons name="help-circle" size={20} color="#8B5FBF" />
              <Text style={styles.quizButtonText}>
                {lesson.userProgress?.quizScore !== undefined && lesson.userProgress?.quizScore !== null
                  ? 'Retake Quiz'
                  : 'Take Quiz'
                }
              </Text>
            </TouchableOpacity>
          )}
          
          {!isCompleted && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={markLessonAsComplete}
              disabled={progressUpdating}
            >
              <LinearGradient
                colors={['#8B5FBF', '#D946EF']}
                style={styles.completeButtonGradient}
              >
                {progressUpdating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.completeButtonText}>Mark Complete</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}

      {renderQuizModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  lessonInfo: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lessonDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 12,
  },
  breadcrumb: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentGroup: {
    marginBottom: 32,
  },
  contentGroupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contentGroupDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
    lineHeight: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 16,
  },
  codeBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5FBF',
  },
  codeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#8B5FBF',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  unsupportedContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  unsupportedText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  noContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noContentText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#100A1F',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quizButton: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderWidth: 1,
    borderColor: '#8B5FBF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5FBF',
  },
  completeButton: {
    // LinearGradient will provide the background
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Quiz Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedOption: {
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    borderColor: '#8B5FBF',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  explanationContainer: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#8B5FBF',
    lineHeight: 20,
  },
  quizFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
