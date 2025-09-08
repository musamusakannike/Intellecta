import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardUser } from '../../services/dashboardService';

interface DashboardHeaderProps {
  user: DashboardUser;
  onProfilePress?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onProfilePress }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user.name.split(' ')[0]} 👋
        </Text>
        <Text style={styles.subtitle}>Ready to Code Today?</Text>
      </View>
      
      <TouchableOpacity style={styles.profileSection} onPress={onProfilePress}>
        {user.profilePicture?.url ? (
          <Image source={{ uri: user.profilePicture.url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color="#8B5FBF" />
          </View>
        )}
        {user.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={10} color="#FFD700" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  leftSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  profileSection: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#8B5FBF',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderWidth: 2,
    borderColor: '#8B5FBF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#8B5FBF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#100A1F',
  },
});

export default DashboardHeader;
