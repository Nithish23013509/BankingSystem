import api from './api';

const mapAccount = (data) => ({
  ...data,
  accountHolderName: data.holderName || 'Unknown',
  status: data.status || 'ACTIVE',
  accountType: data.accountType || 'SAVINGS',
  accountNumber: data.accountNumber || '0000',
  balance: data.balance || 0,
});

const accountService = {
  /**
   * Fetch all accounts.
   * @returns {Promise<Array>}
   */
  async getAllAccounts() {
    const response = await api.get('/account');
    return (response.data || []).map(mapAccount);
  },

  /**
   * Fetch a single account by its id.
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getAccountById(id) {
    const response = await api.get(`/account/${id}`);
    if (!response.data) {
      throw new Error('Account not found');
    }
    return mapAccount(response.data);
  },

  /**
   * Create a new account.
   * @param {{ accountHolderName: string, email: string, accountType: string, initialDeposit: number }} data
   * @returns {Promise<Object>}
   */
  async createAccount(data) {
    const response = await api.post('/create', {
      holderName: data.holderName,
      accountNumber: String(4021580000 + Math.floor(Math.random() * 10000)), // Temp generate acc no.
      balance: Number(data.initialDeposit) || 0,
      email: data.email,
      accountType: data.type || data.accountType,
    });
    return response.data;
  },

  /**
   * Update an existing account.
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateAccount(id, data) {
    const response = await api.put(`/update/${id}`, {
      holderName: data.holderName || data.accountHolderName,
      accountNumber: data.accountNumber,
      balance: data.balance,
      email: data.email,
      accountType: data.type || data.accountType,
      status: data.status,
    });
    return response.data;
  },

  /**
   * Delete an account by id.
   * @param {number|string} id
   * @returns {Promise<{ success: boolean }>}
   */
  async deleteAccount(id) {
    const response = await api.delete(`/account/${id}`);
    return response.data;
  },

  /**
   * Fetch transactions for a specific account (matched by accountNumber).
   * @param {string} accountNumberOrId
   * @returns {Promise<Array>}
   */
  async getTransactionsByAccount(accountNumberOrId) {
    return this.getTransactionsByAccountId(accountNumberOrId);
  },

  async deposit(accountId, amount, description = '') {
    const response = await api.put(`/deposit/${accountId}/${amount}`);
    return response.data;
  },

  async withdraw(accountId, amount, description = '') {
    const response = await api.put(`/withdraw/${accountId}/${amount}`);
    return response.data;
  },

  async transfer(fromId, toId, amount, description = '') {
    const response = await api.put(`/transfer/${fromId}/${toId}/${amount}`);
    return response.data;
  },

  async getTransactionsByAccountId(accountId) {
    try {
      const response = await api.get(`/account/${accountId}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions', error);
      return [];
    }
  },
};

export default accountService;
