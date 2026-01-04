// import { emailRules, passwordRules, required, optional } from '@/composables/useFormValidationRules';
// Reusable rules v <q-input :rules="[required]" /> VZDY ako pole

// Reusable rules
export const required = (val) => !!val || "Required";
export const email = (val) => /.+@.+\..+/.test(val) || "Invalid email";
export const minLength = (len) => (val) => String(val).length >= len || `Min ${len} chars`;
export const passwordMatch = (otherPasswordRef) => (val) => val === otherPasswordRef.value || "Passwords must match";
// Common sets
export const emailRules = [required, email];
export const passwordRules = [required, minLength(6)];
export const optional = [];
