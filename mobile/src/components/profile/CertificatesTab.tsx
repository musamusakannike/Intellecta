import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Certificate } from '../../services/profileService';

interface CertificatesTabProps {
  certificates: Certificate[];
}

const CertificatesTab: React.FC<CertificatesTabProps> = ({ certificates }) => {
  const handleViewCertificate = async (certificateUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(certificateUrl);
      if (supported) {
        await Linking.openURL(certificateUrl);
      }
    } catch (error) {
      console.error('Error opening certificate:', error);
    }
  };

  const getGradeColor = (grade?: string): string => {
    if (!grade) return '#888';
    switch (grade.charAt(0)) {
      case 'A': return '#10B981';
      case 'B': return '#F59E0B';
      case 'C': return '#EF4444';
      default: return '#888';
    }
  };

  const renderCertificate = ({ item }: { item: Certificate }) => {
    const gradeColor = getGradeColor(item.grade);
    
    return (
      <TouchableOpacity 
        style={styles.certificateCard}
        onPress={() => handleViewCertificate(item.certificateUrl)}
        activeOpacity={0.7}
      >
        <View style={styles.certificateHeader}>
          <Image 
            source={{ uri: item.thumbnail }} 
            style={styles.courseThumbnail}
          />
          <View style={styles.certificateInfo}>
            <Text style={styles.courseName} numberOfLines={2}>
              {item.courseName}
            </Text>
            <Text style={styles.instructorName}>
              by {item.instructorName}
            </Text>
            <Text style={styles.completedDate}>
              Completed {new Date(item.completedAt).toLocaleDateString()}
            </Text>
          </View>
          {item.grade && (
            <View style={[styles.gradeBadge, { borderColor: gradeColor }]}>
              <Text style={[styles.gradeText, { color: gradeColor }]}>
                {item.grade}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Skills learned:</Text>
          <View style={styles.skillsRow}>
            {item.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.certificateIcon}>
            <Ionicons name="school" size={16} color="#8B5FBF" />
          </View>
          <Text style={styles.actionText}>Tap to view certificate</Text>
          <Ionicons name="chevron-forward" size={16} color="#888" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="school-outline" size={64} color="#666" />
      </View>
      <Text style={styles.emptyTitle}>No Certificates Yet</Text>
      <Text style={styles.emptyDescription}>
        Complete courses to earn certificates and showcase your achievements
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{certificates.length}</Text>
          <Text style={styles.statLabel}>Certificates</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {certificates.filter(c => c.grade && c.grade.startsWith('A')).length}
          </Text>
          <Text style={styles.statLabel}>Grade A</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {certificates.reduce((total, cert) => total + cert.skills.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Skills</Text>
        </View>
      </View>

      {certificates.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={certificates}
          renderItem={renderCertificate}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  certificateCard: {
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
  },
  certificateInfo: {
    flex: 1,
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 12,
    color: '#8B5FBF',
    marginBottom: 2,
  },
  completedDate: {
    fontSize: 12,
    color: '#888',
  },
  gradeBadge: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: 'rgba(139, 95, 191, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skillText: {
    fontSize: 11,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 95, 191, 0.1)',
  },
  certificateIcon: {
    marginRight: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default CertificatesTab;
