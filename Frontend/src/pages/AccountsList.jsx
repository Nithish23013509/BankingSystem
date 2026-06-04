import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import accountService from '../services/accountService';
import { useNotification } from '../context/NotificationContext';
import '../styles/accounts.css';

const ITEMS_PER_PAGE = 8;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

/* ── Inline SVG Icons ──────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg className="filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ── Skeleton Rows ─────────────────────────────────────────────────────────── */
function SkeletonRows({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div className="skeleton-row" key={i}>
      <div className="skeleton-cell" />
      <div className="skeleton-cell" />
      <div className="skeleton-cell" />
      <div className="skeleton-cell" />
      <div className="skeleton-cell" />
      <div className="skeleton-cell" />
    </div>
  ));
}

/* ── Delete Confirmation Modal ─────────────────────────────────────────────── */
function DeleteModal({ account, onConfirm, onCancel, deleting }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Account</h3>
        <p>
          Are you sure you want to delete account{' '}
          <strong>{account.accountNumber}</strong> belonging to{' '}
          <strong>{account.accountHolderName}</strong>? This action cannot be
          undone.
        </p>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button className="btn-modal-delete" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   AccountsList — main export
   ══════════════════════════════════════════════════════════════════════════════ */
export default function AccountsList() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Load data ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      setLoading(true);
      const data = await accountService.getAllAccounts();
      setAccounts(data);
    } catch {
      addNotification('Failed to load accounts', 'error');
    } finally {
      setLoading(false);
    }
  }

  /* ── Filtering ───────────────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let result = [...accounts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountHolderName.toLowerCase().includes(q) ||
          a.accountNumber.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'ALL') {
      result = result.filter((a) => a.accountType === typeFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((a) => a.status === statusFilter);
    }

    return result;
  }, [accounts, searchQuery, typeFilter, statusFilter]);

  /* ── Pagination ──────────────────────────────────────────────────────────── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedAccounts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter]);

  /* ── Delete handler ──────────────────────────────────────────────────────── */
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await accountService.deleteAccount(deleteTarget.id);
      setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      addNotification(`Account ${deleteTarget.accountNumber} deleted successfully`, 'success');
      setDeleteTarget(null);
    } catch {
      addNotification('Failed to delete account', 'error');
    } finally {
      setDeleting(false);
    }
  }

  /* ── Click handlers ──────────────────────────────────────────────────────── */
  function onDeleteClick(e, account) {
    e.stopPropagation();
    setDeleteTarget(account);
  }

  function onEditClick(e, id) {
    e.stopPropagation();
    navigate(`/accounts/update/${id}`);
  }

  function onViewClick(e, id) {
    e.stopPropagation();
    navigate(`/accounts/${id}`);
  }

  /* ── Badge helpers ───────────────────────────────────────────────────────── */
  function typeBadgeClass(type) {
    return `badge badge-${type.toLowerCase()}`;
  }

  function statusBadgeClass(status) {
    return `badge badge-${status.toLowerCase()}`;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="accounts-page">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="accounts-page-header">
        <div>
          <h1>Accounts</h1>
          <div className="subtitle">
            Manage all banking accounts • {accounts.length} total
          </div>
        </div>
        <Link to="/accounts/create" className="btn-create-account">
          <PlusIcon />
          Create Account
        </Link>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="accounts-filters">
        <div className="filter-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, account number, or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-select">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="SAVINGS">Savings</option>
            <option value="CHECKING">Checking</option>
            <option value="BUSINESS">Business</option>
          </select>
        </div>
        <div className="filter-select">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Loading skeleton ───────────────────────────────────────────────── */}
      {loading && (
        <div className="accounts-table-wrapper">
          <SkeletonRows count={6} />
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="accounts-table-wrapper">
          <div className="accounts-empty">
            <div className="accounts-empty-icon">
              <FolderIcon />
            </div>
            <h3>No accounts found</h3>
            <p>
              {searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first bank account.'}
            </p>
            {!searchQuery && typeFilter === 'ALL' && statusFilter === 'ALL' && (
              <Link to="/accounts/create" className="btn-create-account">
                <PlusIcon />
                Create Account
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Desktop Table ──────────────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="accounts-table-wrapper">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Holder Name</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccounts.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => navigate(`/accounts/${account.id}`)}
                >
                  <td className="cell-account-number">{account.accountNumber}</td>
                  <td>{account.accountHolderName}</td>
                  <td>
                    <span className={typeBadgeClass(account.accountType)}>
                      {account.accountType}
                    </span>
                  </td>
                  <td className={`cell-balance ${account.balance > 0 ? 'positive' : 'zero'}`}>
                    {formatCurrency(account.balance)}
                  </td>
                  <td>
                    <span className={statusBadgeClass(account.status)}>
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-action view" title="View details" onClick={(e) => onViewClick(e, account.id)}>
                        <EyeIcon />
                      </button>
                      <button className="btn-action edit" title="Edit account" onClick={(e) => onEditClick(e, account.id)}>
                        <EditIcon />
                      </button>
                      <button className="btn-action delete" title="Delete account" onClick={(e) => onDeleteClick(e, account)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="accounts-pagination">
              <span className="pagination-info">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{' '}
                {filtered.length}
              </span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Card View ───────────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="accounts-cards">
          {paginatedAccounts.map((account) => (
            <div
              key={account.id}
              className="account-card"
              onClick={() => navigate(`/accounts/${account.id}`)}
            >
              <div className="account-card-header">
                <span className="account-card-number">{account.accountNumber}</span>
                <span className={statusBadgeClass(account.status)}>{account.status}</span>
              </div>
              <div className="account-card-body">
                <div className="account-card-name">{account.accountHolderName}</div>
                <div className="account-card-row">
                  <span className="account-card-label">Type</span>
                  <span className={typeBadgeClass(account.accountType)}>{account.accountType}</span>
                </div>
                <div className="account-card-row">
                  <span className="account-card-label">Balance</span>
                  <span className="account-card-balance">{formatCurrency(account.balance)}</span>
                </div>
              </div>
              <div className="account-card-actions">
                <button className="btn-action view" title="View" onClick={(e) => onViewClick(e, account.id)}>
                  <EyeIcon />
                </button>
                <button className="btn-action edit" title="Edit" onClick={(e) => onEditClick(e, account.id)}>
                  <EditIcon />
                </button>
                <button className="btn-action delete" title="Delete" onClick={(e) => onDeleteClick(e, account)}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}

          {/* Mobile pagination */}
          {totalPages > 1 && (
            <div className="accounts-pagination" style={{ background: 'transparent', border: 'none', padding: '16px 0' }}>
              <span className="pagination-info">Page {currentPage} of {totalPages}</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  <ChevronLeftIcon />
                </button>
                <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Delete Modal ───────────────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          account={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
