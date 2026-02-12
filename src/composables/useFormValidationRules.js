// import { emailRules, passwordRules, required, optional } from '@/composables/useFormValidationRules';
// Reusable rules v <q-input :rules="[required]" /> VZDY ako pole

// Reusable rules
export const required = (val) => !!val || "Required";
export const email = (val) => /.+@.+\..+/.test(val) || "Invalid email";
export const minLength = (len) => (val) => String(val).length >= len || `Min ${len} chars`;
export const passwordMatch = (otherPasswordRef) => (val) => val === otherPasswordRef.value || "Passwords must match";

// Common sets
export const optional = [];
export const emailRules = [required, email];
export const passwordRules = [required, minLength(6)];

export const coordsRules = [(v) => !v || coordsDec(v) || coordsDMS(v) || "Enter valid coordinates in decimal (e.g. 48.8584) or DMS format (e.g. 48°51'29.6\"N)"];
export const coordsDec = (val) => {
	return /^-?\d{1,3}\.\d+$/.test(val) || false;
};
export const coordsDMS = (val) => {
	return /^(\d{1,3})°(\d{1,2})'(\d{1,2}(?:\.\d+)?)"[NSEW]$/.test(val) || false;
};
