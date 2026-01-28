import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Calculate time ago
export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format player level for display
export function formatLevel(level: string): string {
  const levelMap: Record<string, string> = {
    youth: 'Youth',
    middle_school: 'Middle School',
    high_school: 'High School',
    college: 'College',
    pro: 'Professional',
    overseas: 'Overseas',
    nba: 'NBA',
    rec: 'Recreational',
  };
  return levelMap[level] || capitalize(level);
}

// Format pipeline status for display
export function formatPipelineStatus(status: string): string {
  const statusMap: Record<string, string> = {
    intake_started: 'Intake Started',
    intake_completed: 'Intake Completed',
    payment_pending: 'Payment Pending',
    paid: 'Paid',
    tests_pending: 'Tests Pending',
    tests_submitted: 'Tests Submitted',
    review_in_progress: 'Review In Progress',
    profile_delivered: 'Profile Delivered',
    high_ticket_invited: 'High-Ticket Invited',
    enrolled_mentorship: 'Enrolled in Mentorship',
  };
  return statusMap[status] || capitalize(status.replace(/_/g, ' '));
}

// Get status color classes
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    intake_started: 'bg-gray-500',
    intake_completed: 'bg-blue-500',
    payment_pending: 'bg-yellow-500',
    paid: 'bg-green-500',
    tests_pending: 'bg-orange-500',
    tests_submitted: 'bg-purple-500',
    review_in_progress: 'bg-indigo-500',
    profile_delivered: 'bg-emerald-500',
    high_ticket_invited: 'bg-gold-500',
    enrolled_mentorship: 'bg-gold-600',
  };
  return colorMap[status] || 'bg-gray-500';
}

// Calculate BB Level from test results
export function calculateBBLevel(tests: {
  fourteenSpotMakes?: number;
  flatFlightGoodReps?: number;
  deepDistanceRimContacts?: number;
  backRimConsecutive?: number;
  oversizedScore?: number;
  speedThresholdMakes?: number;
  spectrumMakes?: number;
}): number {
  // Level 4: Elite
  if (tests.spectrumMakes && tests.spectrumMakes >= 8) {
    return 4;
  }

  // Level 3: Adaptive
  if (tests.oversizedScore && tests.oversizedScore >= 7) {
    return 3;
  }

  // Level 2: Calibrated
  if (
    tests.deepDistanceRimContacts &&
    tests.deepDistanceRimContacts >= 8 &&
    tests.backRimConsecutive &&
    tests.backRimConsecutive >= 3
  ) {
    return 2;
  }

  // Level 1: Foundation
  if (
    tests.fourteenSpotMakes &&
    tests.fourteenSpotMakes >= 10 &&
    tests.flatFlightGoodReps &&
    tests.flatFlightGoodReps >= 7
  ) {
    return 1;
  }

  // Unranked
  return 0;
}

// Get BB Level name
export function getBBLevelName(level: number): string {
  const names: Record<number, string> = {
    0: 'Unranked',
    1: 'Foundation',
    2: 'Calibrated',
    3: 'Adaptive',
    4: 'Master',
  };
  return names[level] || 'Unknown';
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (US format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?1?\d{10,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Format phone for display
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}
