const parseBooleanFlag = (value: unknown, defaultValue: boolean): boolean => {
  if (typeof value !== 'string' || value.trim() === '') {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) return false;

  return defaultValue;
};

type SiteEnv = 'development' | 'staging' | 'production';

const parseSiteEnv = (value: unknown): SiteEnv => {
  if (typeof value !== 'string' || value.trim() === '') {
    return import.meta.env.DEV ? 'development' : 'production';
  }

  const normalized = value.trim().toLowerCase();
  if (['development', 'staging', 'production'].includes(normalized)) {
    return normalized as SiteEnv;
  }

  throw new Error('VITE_SITE_ENV must be one of: development, staging, production');
};

export const SITE_ENV = parseSiteEnv(import.meta.env.VITE_SITE_ENV);
export const shouldNoindex = SITE_ENV !== 'production';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';

if (!configuredApiBaseUrl && SITE_ENV !== 'development') {
  throw new Error('VITE_API_BASE_URL is required when VITE_SITE_ENV is staging or production');
}

export const API_BASE_URL = configuredApiBaseUrl || 'http://localhost:8000/api/v1';

const paymentsFlag = parseBooleanFlag(import.meta.env.VITE_PAYMENTS_ENABLED, false);
export const isRazorpayEnabled = parseBooleanFlag(
  import.meta.env.VITE_RAZORPAY_ENABLED,
  paymentsFlag
);

if (paymentsFlag && !isRazorpayEnabled) {
  throw new Error('VITE_PAYMENTS_ENABLED=true requires VITE_RAZORPAY_ENABLED=true');
}

export const isPaymentsEnabled = paymentsFlag && isRazorpayEnabled;
