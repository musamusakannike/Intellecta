import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'achievements' | 'certificates' | 'settings';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      key: 'achievements' as TabType,
      title: 'Achievements',
      icon: 'trophy-outline',
      activeIcon: 'trophy',
    },
    {
      key: 'certificates' as TabType,
      title: 'Certificates',
      icon: 'school-outline',
      activeIcon: 'school',
    },
    {
      key: 'settings' as TabType,
      title: 'Settings',
      icon: 'settings-outline',
      activeIcon: 'settings',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon as any : tab.icon as any}
              size={20}
              color={isActive ? '#8B5FBF' : '#888'}
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  activeTabText: {
    color: '#8B5FBF',
    fontWeight: '600',
  },
});

export default ProfileTabs;
