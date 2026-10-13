export const COLORS = {
  background: '#0a0d14',
  cardBg: '#111726',
  cardBgElevated: '#172033',
  border: '#1f293d',
  borderHighlight: '#334155',
  
  // Alert colors
  crimson: '#ef4444',
  crimsonDark: '#991b1b',
  crimsonGlow: 'rgba(239, 68, 68, 0.35)',
  crimsonMuted: 'rgba(239, 68, 68, 0.12)',
  
  amber: '#f59e0b',
  amberMuted: 'rgba(245, 158, 11, 0.15)',
  amberBorder: '#d97706',
  
  cyan: '#06b6d4',
  cyanMuted: 'rgba(6, 182, 212, 0.15)',
  
  emerald: '#10b981',
  emeraldMuted: 'rgba(16, 185, 129, 0.15)',
  
  // Text colors
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textAccent: '#fca5a5',
};

export const DEFAULT_NOTICE_MESSAGE = 
  'CRITICAL ALERT: An unauthorized operating system event or anomalous activity has been flagged. ' +
  'Immediate operator intervention is required. Continuous acoustic telemetry is active at maximum system ceiling.';

export const NOTICE_PRESETS = [
  {
    id: 'security',
    title: 'Security Lockdown',
    badge: 'LEVEL 1 - SYSTEM INTEGRITY',
    text: 'CRITICAL SECURITY NOTICE: Unauthorized elevated privilege request detected. Immediate administrator verification mandated.'
  },
  {
    id: 'hardware',
    title: 'Hardware Overheat / Voltage',
    badge: 'HARDWARE CRITICAL',
    text: 'HARDWARE WARNING: Core thermal junction temperature exceeded safe operating threshold. Throttling active. Remove thermal obstruction.'
  },
  {
    id: 'evacuation',
    title: 'Emergency Evacuation Broadcast',
    badge: 'PUBLIC SAFETY ADVISORY',
    text: 'EMERGENCY NOTIFICATION: Mandatory localized evacuation instruction issued. Cease terminal operations and proceed to designated exit points.'
  },
  {
    id: 'custom',
    title: 'Custom Operator Notice',
    badge: 'CUSTOM ADVISORY',
    text: DEFAULT_NOTICE_MESSAGE
  }
];
