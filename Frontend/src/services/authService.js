import api from './api';

// ─── Auth Service ─────────────────────────────────────────────────────────────
const authService = {
  /**
   * Register a new user.
   * @param {{ email: string, password: string }} credentials
   */
  async register(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required.');
    }
    
    const response = await api.post('/auth/register', {
      username: credentials.email,
      password: credentials.password
    });
    
    if (response.data !== 'Registration successful') {
      throw new Error(response.data || 'Registration failed');
    }
    
    return true;
  },

  /**
   * Login with credentials.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<object>} resolved user data
   */
  async login(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required.');
    }

    try {
      const response = await api.post('/auth/login', {
        username: credentials.email,
        password: credentials.password,
      });

      const token = response.data;
      if (token === 'Invalid Credentials' || !token) {
        throw new Error('Invalid email or password.');
      }

      // Store session artifacts
      localStorage.setItem('token', token);
      
      // Since backend doesn't return user details, create a mock user object based on the email
      const user = {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: credentials.email === 'admin' ? 'ADMIN' : 'USER',
        avatar: 'https://i.pravatar.cc/150?u=' + credentials.email
      };
      
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
         throw new Error('Invalid email or password.');
      }
      throw error;
    }
  },

  /**
   * Clear the session from localStorage.
   * @returns {Promise<void>}
   */
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Retrieve the current user from localStorage.
   * @returns {object|null}
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  /**
   * Retrieve the stored JWT token.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Check whether a token exists in storage.
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export default authService;
