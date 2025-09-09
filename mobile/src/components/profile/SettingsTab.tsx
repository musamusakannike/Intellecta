import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsTabProps {
  user: any;
  onUpdateProfile?: (data: any) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ user, onUpdateProfile }) => {
  const { logout } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);

  const handleSaveName = async () => {
    if (tempName.trim() && tempName !== user?.name) {
      try {
        await onUpdateProfile?.({ name: tempName.trim() });
        setEditingName(false);
      } catch (error) {
        console.error('Failed to update name:', error);
        Alert.alert('Error', 'Failed to update name. Please try again.');
      }
    } else {
      setEditingName(false);
      setTempName(user?.name || '');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion
            Alert.alert('Feature Coming Soon', 'Account deletion will be available soon.');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    destructive = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    destructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress && !rightComponent}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, destructive && styles.destructiveIcon]}>
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={destructive ? '#EF4444' : '#8B5FBF'} 
          />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent || (
          onPress && <Ionicons name="chevron-forward" size={16} color="#888" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        
        <SettingItem
          icon="person-outline"
          title="Name"
          subtitle={user?.name}
          rightComponent={
            editingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  onBlur={handleSaveName}
                  onSubmitEditing={handleSaveName}
                  autoFocus
                  returnKeyType="done"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={handleSaveName}>
                  <Ionicons name="checkmark" size={20} color="#10B981" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Ionicons name="pencil" size={16} color="#888" />
              </TouchableOpacity>
            )
          }
        />
        
        <SettingItem
          icon="mail-outline"
          title="Email"
          subtitle={user?.email}
          onPress={() => Alert.alert('Coming Soon', 'Email editing will be available soon.')}
        />
        
        <SettingItem
          icon="camera-outline"
          title="Profile Picture"
          subtitle="Change your profile photo"
          onPress={() => Alert.alert('Coming Soon', 'Profile picture upload will be available soon.')}
        />
      </View>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          subtitle="Receive updates about courses and progress"
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#333', true: 'rgba(139, 95, 191, 0.3)' }}
              thumbColor={notificationsEnabled ? '#8B5FBF' : '#666'}
            />
          }
        />
        
        <SettingItem
          icon="wifi-outline"
          title="Download over Wi-Fi only"
          subtitle="Prevent mobile data usage for downloads"
          rightComponent={
            <Switch
              value={downloadOverWifi}
              onValueChange={setDownloadOverWifi}
              trackColor={{ false: '#333', true: 'rgba(139, 95, 191, 0.3)' }}
              thumbColor={downloadOverWifi ? '#8B5FBF' : '#666'}
            />
          }
        />
        
        <SettingItem
          icon="moon-outline"
          title="Theme"
          subtitle="Dark theme"
          onPress={() => Alert.alert('Coming Soon', 'Theme selection will be available soon.')}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <SettingItem
          icon="help-circle-outline"
          title="Help Center"
          subtitle="Get help with the app"
          onPress={() => Alert.alert('Coming Soon', 'Help center will be available soon.')}
        />
        
        <SettingItem
          icon="bug-outline"
          title="Report a Bug"
          subtitle="Let us know about issues"
          onPress={() => Alert.alert('Coming Soon', 'Bug reporting will be available soon.')}
        />
        
        <SettingItem
          icon="star-outline"
          title="Rate the App"
          subtitle="Rate us in the app store"
          onPress={() => Alert.alert('Coming Soon', 'App store rating will be available soon.')}
        />
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <SettingItem
          icon="log-out-outline"
          title="Sign Out"
          onPress={handleLogout}
        />
        
        <SettingItem
          icon="trash-outline"
          title="Delete Account"
          subtitle="Permanently delete your account and data"
          onPress={handleDeleteAccount}
          destructive
        />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Intellecta v1.0.0</Text>
        <Text style={styles.appCopyright}>© 2024 Intellecta Learning Platform</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  destructiveText: {
    color: '#EF4444',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    minWidth: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#8B5FBF',
    paddingVertical: 4,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 11,
    color: '#666',
  },
});

export default SettingsTab;
