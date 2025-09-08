// Mock API service for testing without backend
// Replace this with your actual backend once it's ready

const MOCK_USERS: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}> = [];

const generateId = () => Math.random().toString(36).substr(2, 9);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  async login(email: string, password: string) {
    // Simulate network delay
    await delay(1000);

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      data: {
        user: userWithoutPassword,
        token: `mock_token_${user.id}`,
        refreshToken: `mock_refresh_${user.id}`,
      },
      message: 'Login successful',
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  async register(name: string, email: string, password: string) {
    // Simulate network delay
    await delay(1500);

    // Check if user already exists
    if (MOCK_USERS.find(u => u.email === email)) {
      throw new Error('User already exists with this email');
    }

    const user = {
      id: generateId(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_USERS.push(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      data: {
        user: userWithoutPassword,
        token: `mock_token_${user.id}`,
        refreshToken: `mock_refresh_${user.id}`,
      },
      message: 'Registration successful',
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  async forgotPassword(email: string) {
    await delay(1000);
    
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found with this email');
    }

    return {
      data: { message: 'Password reset email sent' },
      message: 'Reset email sent successfully',
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  async verifyToken() {
    await delay(500);
    
    return {
      data: { valid: true },
      message: 'Token is valid',
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
};
