import api from './axiosConfig';

// ── Auth ───────────────────────────────────────────────────────────────────
export const login = (credentials) =>
  api.post('/auth/login', credentials);

export const register = (credentials) =>
  api.post('/auth/register', credentials);

// ── Users ─────────────────────────────────────────────────────────────────
export const getAllUsers = () =>
  api.get('/users');

// ── Accounts ──────────────────────────────────────────────────────────────
export const createAccount = (data) =>
  api.post('/create', data);

export const getAllAccounts = () =>
  api.get('/accounts');

export const getMyAccounts = () =>
  api.get('/my-accounts');

export const getAccountById = (id) =>
  api.get(`/account/${id}`);

export const updateAccount = (id, data) =>
  api.put(`/update/${id}`, data);

export const deleteAccount = (id) =>
  api.delete(`/account/${id}`);

// ── Transactions ──────────────────────────────────────────────────────────
export const deposit = (id, amount) =>
  api.put(`/deposit/${id}/${amount}`);

export const withdraw = (id, amount) =>
  api.put(`/withdraw/${id}/${amount}`);

export const transfer = (fromId, toId, amount) =>
  api.put(`/transfer/${fromId}/${toId}/${amount}`);

export const getTransactions = (accountId) =>
  api.get(`/account/${accountId}/transactions`);
