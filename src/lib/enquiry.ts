import { hotel } from '../data/hotel';

export interface EnquiryPayload {
  source: string;
  name: string;
  phone: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  roomType?: string;
  [key: string]: string | undefined;
}

/**
 * Send an enquiry by email via the server.
 *
 * Throws on any non-2xx response. Callers are expected to fall back to
 * WhatsApp (see buildWhatsAppEnquiryUrl) so a guest's details are never lost
 * when mail is misconfigured or down — the server returns 503 in that case.
 */
export async function submitEnquiry(payload: EnquiryPayload) {
  const response = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Unable to send enquiry right now.');
  }

  return response.json();
}

/* Insertion order is the order the lines appear in the WhatsApp message.
   `email` and `message` are here because the contact form collects them —
   without an entry the guest's own note was silently dropped from the
   fallback, which is the one message that must never lose anything. */
const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  guests: 'Guests',
  roomType: 'Room',
  message: 'Message',
};

/**
 * Build a wa.me link that pre-fills the enquiry the guest already typed, so the
 * WhatsApp fallback needs zero re-entry. Order is intentional (name/phone
 * first), and empty fields are skipped.
 */
export function buildWhatsAppEnquiryUrl(payload: EnquiryPayload) {
  const lines = ['Hi Hotel Royal Fort, I would like to enquire about a stay.', ''];

  for (const key of Object.keys(FIELD_LABELS)) {
    const value = payload[key];
    if (value && value.trim()) lines.push(`${FIELD_LABELS[key]}: ${value.trim()}`);
  }

  return `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}
