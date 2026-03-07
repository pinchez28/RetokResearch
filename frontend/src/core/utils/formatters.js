// src/core/utils/formatters.js

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0';
  return amount.toLocaleString();
};

/**
 * Format date to readable format
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Not set';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date with time
 * @param {string} date - Date string
 * @returns {string} Full formatted date with time
 */
export const formatFullDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date as time ago
 * @param {string} dateStr - Date string
 * @returns {string} Time ago string
 */
export const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  } catch {
    return '';
  }
};

/**
 * Get status color class for proposal status
 * @param {string} status - Proposal status
 * @returns {string} CSS classes for status
 */
export const getStatusColorClass = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
    under_review: 'bg-indigo-100 text-indigo-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status dot color class
 * @param {string} status - Status
 * @returns {string} CSS class for status dot
 */
export const getStatusDotClass = (status) => {
  const colors = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-purple-500',
    under_review: 'bg-indigo-500',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-500';
};
