/**
 * Alberta Mountain Air — Form & Phone Registry
 */

export const FORMS = [
  {
    id: 'contact-form-calgary',
    label: 'Calgary',
    description: 'All Alberta Mountain Air / Calgary pages',
  },
] as const;

export const PHONES = [
  {
    id: 'calgary-main',
    label: 'Calgary Main Line',
    number: '(403) 532-6345',
    description: 'Primary Alberta Mountain Air phone number',
  },
] as const;

// Derived types — used in config.ts for Zod enum validation
export type FormId = typeof FORMS[number]['id'];
export type PhoneId = typeof PHONES[number]['id'];

export const FORM_IDS = FORMS.map(f => f.id) as [FormId, ...FormId[]];
export const PHONE_IDS = PHONES.map(p => p.id) as [PhoneId, ...PhoneId[]];

// Lookup helpers
export const getForm = (id: FormId) => FORMS.find(f => f.id === id);
export const getPhone = (id: PhoneId) => PHONES.find(p => p.id === id);
