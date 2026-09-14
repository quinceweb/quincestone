export interface CommerceCustomer {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  name: string;
  phone: string | null;
  status: string;
}

export interface AccountAddress {
  id: string;
  label: string | null;
  recipient_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state_region: string | null;
  postal_code: string | null;
  country_code: string;
  phone: string | null;
  is_default: boolean;
}

export interface AccountNotificationPreferences {
  order_updates: boolean;
  account_security: boolean;
  product_updates: boolean;
  field_notes: boolean;
  recommendations: boolean;
  marketing: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: AccountNotificationPreferences = {
  order_updates: true,
  account_security: true,
  product_updates: false,
  field_notes: false,
  recommendations: false,
  marketing: false,
};

export interface AccountDataResult<T> {
  data: T | null;
  error: string | null;
}
