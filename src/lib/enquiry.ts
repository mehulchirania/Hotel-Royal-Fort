type EnquiryPayload = Record<string, string>;

export async function submitEnquiry(payload: EnquiryPayload) {
  const response = await fetch('/api/enquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Unable to send enquiry right now.');
  }

  return response.json();
}
