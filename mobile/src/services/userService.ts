import apiService from './api';

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ProfilePictureResponse {
  user: any;
  profilePicture: {
    url: string;
    publicId: string;
  };
}

class UserService {
  async updateProfile(data: UpdateProfileData): Promise<any> {
    try {
      const response = await apiService.put('/users/profile', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async uploadProfilePicture(imageUri: string): Promise<ProfilePictureResponse> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await apiService.post<ProfilePictureResponse>('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      throw error;
    }
  }

  async deleteProfilePicture(): Promise<any> {
    try {
      const response = await apiService.delete('/users/profile-picture');
      return response.data;
    } catch (error) {
      console.error('Failed to delete profile picture:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.put('/users/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await apiService.delete('/users/account');
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  }

  async updateExpoPushToken(token: string): Promise<void> {
    try {
      await apiService.put('/users/expo-token', { expoPushToken: token });
    } catch (error) {
      console.error('Failed to update expo push token:', error);
      throw error;
    }
  }

  async checkPremiumAccess(): Promise<{
    hasAccess: boolean;
    isPremium: boolean;
    premiumExpiryDate?: string;
    isExpired: boolean;
    daysUntilExpiry?: number;
  }> {
    try {
      const response = await apiService.get('/users/premium/access');
      return response.data;
    } catch (error) {
      console.error('Failed to check premium access:', error);
      throw error;
    }
  }

  async getPremiumFeatures(): Promise<{
    features: {
      name: string;
      description: string;
      icon: string;
    }[];
    pricing: {
      amount: number;
      currency: string;
      duration: string;
      savings: string;
    };
  }> {
    try {
      const response = await apiService.get('/users/premium/features');
      return response.data;
    } catch (error) {
      console.error('Failed to get premium features:', error);
      throw error;
    }
  }
}

export default new UserService();
