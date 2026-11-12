import { hotel } from './hotel';

export interface LegalSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface LegalDoc {
  id: LegalDocId;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export type LegalDocId = 'privacy' | 'cookies' | 'terms' | 'cancellation' | 'faq';

const UPDATED = 'November 2026';

const contactLine = hotel.dataContact.name
  ? `${hotel.dataContact.name}, ${hotel.dataContact.role}`
  : hotel.dataContact.role;

export const legalDocs: Record<LegalDocId, LegalDoc> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: UPDATED,
    intro: `This policy explains what personal data ${hotel.name}, ${hotel.city}, collects when you use this website or enquire about a stay, why, how long we keep it, and the rights you have under the Digital Personal Data Protection Act, 2023 and other applicable Indian law.`,
    sections: [
      {
        heading: 'Who is responsible',
        body: `${hotel.name}, ${hotel.address}, is the data fiduciary for the information described here. Our contact for privacy questions and complaints is ${contactLine}, at ${hotel.dataContact.email} or ${hotel.phoneDisplay}.`,
      },
      {
        heading: 'Information we collect',
        body: 'We only collect what we need to respond to an enquiry or host your stay:',
        bullets: [
          'Enquiry forms — name, phone number, email address (where asked), dates of stay, room preference, number of guests and any message you write. We collect these only after you tick the consent box.',
          'Calls and WhatsApp — whatever you share when you contact us.',
          'At check-in — identity and address details required under applicable Indian hospitality regulations.',
          'Optional site analytics — pages viewed, referrer, device and browser type, language, time zone and a one-way hashed form of your IP address. This is collected ONLY if you click Accept on the privacy banner.',
          'Optional location — approximate or precise location, ONLY if you accept analytics and then separately allow your browser to share it.',
        ],
      },
      {
        heading: 'Why we use it (purpose and consent)',
        bullets: [
          'To respond to enquiries, confirm availability and share tariffs — on the basis of your consent given in the form.',
          'To manage your reservation, stay and any event or banquet booking.',
          'To meet legal, tax and guest-record obligations.',
          'To understand how the website is used and improve it — only with your consent to analytics.',
        ],
      },
      {
        heading: 'Withdrawing consent',
        body: `You can withdraw consent at any time. Analytics: use “Privacy settings” in the footer and choose Reject — your analytics record for the current visit is deleted. Enquiries: write to ${hotel.dataContact.email} and we will stop using and delete the details, except where the law requires us to keep them. Withdrawal does not affect use before it was made.`,
      },
      {
        heading: 'Children and under-18s',
        body: 'This website is not directed at children, and we do not knowingly collect data from anyone under 18 without a parent or guardian’s verifiable consent. Enquiry forms require you to confirm that you are 18 or older, or that you are the parent or legal guardian submitting on the child’s behalf. We do not track, profile or send marketing to children. Rooms are booked by adults only; a minor guest must be accompanied by a parent or guardian at check-in. If you believe a child has given us data, contact us and we will delete it.',
      },
      {
        heading: 'What we do not do',
        bullets: [
          'We do not sell or rent your personal information.',
          'We do not send marketing messages unless you have asked us to.',
          'We do not collect payment card details on this website. Bookings made through Goibibo, MakeMyTrip or any other travel partner are handled on their platform, under their privacy policy.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: 'Only where necessary: travel partners you chose to book through; service providers that run the site for us (Google Cloud / Firebase for hosting and analytics storage, Resend for delivering enquiry emails, Gmail to receive them, Google Fonts and Google Maps which load when you view those parts of the site); and authorities where the law requires it. Some of these providers process data outside India.',
      },
      {
        heading: 'How long we keep it',
        bullets: [
          'Enquiry details — kept for up to 12 months after the enquiry so we can follow up, then deleted.',
          'Site analytics records — automatically deleted after 90 days.',
          'Guest registers and billing records — kept for the period required by applicable law and tax rules, then deleted.',
          'Anything you ask us to delete — removed within 30 days unless the law requires us to retain it.',
        ],
      },
      {
        heading: 'How we protect it',
        body: 'The site is served over HTTPS only. Forms are validated on our server, rate-limited and protected against automated abuse. Analytics data is held in a private database with no public access, and the admin view is restricted to authorised staff. No system is perfectly secure; if a breach affecting your data occurs we will notify you and the Data Protection Board as the law requires.',
      },
      {
        heading: 'Your rights',
        body: `You may ask to access the personal data we hold about you, have it corrected or erased, nominate someone to exercise these rights for you, and complain about how we handle it. Write to ${hotel.dataContact.email} or call ${hotel.phoneDisplay}; we will respond within 30 days. If we have not resolved your complaint you may approach the Data Protection Board of India.`,
      },
      {
        heading: 'Contact us',
        body: `${contactLine}. ${hotel.name}, ${hotel.address}. Phone ${hotel.phoneDisplay}. Email ${hotel.dataContact.email}.`,
      },
    ],
  },

  cookies: {
    id: 'cookies',
    title: 'Cookie & Storage Notice',
    updated: UPDATED,
    intro: 'What this website stores on your device, and the choices you have. This site does not use advertising or cross-site tracking cookies.',
    sections: [
      {
        heading: 'Essential storage (always on)',
        bullets: [
          'rf_theme — remembers light or dark display. Stored in your browser’s localStorage until you clear it.',
          'rf_consent_v1 — remembers your Accept / Reject choice on the privacy banner, for about 6 months.',
        ],
      },
      {
        heading: 'Optional analytics (only if you accept)',
        bullets: [
          'When you click Accept, the site sends one anonymous visit record to our server (pages viewed, referrer, device and browser details, hashed IP address) and records each page you open. Nothing is sent before you accept.',
          'royalFortLocationConsent — remembers your answer if we ask to use your location. Location is requested separately and only after you accept analytics.',
        ],
      },
      {
        heading: 'Third-party content',
        body: 'Google Fonts (typefaces) and Google Maps (embedded map on the Location page) are loaded from Google servers, which receive your IP address and browser details when those load. Their own policies apply.',
      },
      {
        heading: 'Changing your mind',
        body: 'Use “Privacy settings” in the footer at any time to accept or reject analytics. Rejecting stops collection and deletes your current visit record. You can also clear this site’s data from your browser settings.',
      },
      {
        heading: 'Children',
        body: 'If you are under 18, please ask a parent or guardian before accepting analytics. We do not knowingly track children.',
      },
      {
        heading: 'Questions',
        body: `Contact ${contactLine} at ${hotel.dataContact.email}.`,
      },
    ],
  },

  terms: {
    id: 'terms',
    title: 'Terms of Service',
    updated: UPDATED,
    intro: `These terms cover your use of this website and the basis on which ${hotel.name} accepts reservations. Please read them before booking.`,
    sections: [
      {
        heading: 'About this website',
        body: 'This site describes the hotel, its rooms, amenities, and event spaces. We work to keep tariffs, photographs, and facility details accurate and current, but they are indicative and may change without notice. Nothing on this site is a guaranteed offer until we confirm a booking.',
      },
      {
        heading: 'Enquiries and reservations',
        bullets: [
          'Submitting the enquiry form does not create a reservation. A booking exists only once the hotel confirms it directly, or once a travel partner issues a confirmation.',
          'Rooms are subject to availability at the time of confirmation.',
          'Rates are quoted in Indian Rupees and are exclusive of applicable taxes unless stated otherwise.',
          'Bookings made through Goibibo or another travel partner are also governed by that partner’s terms.',
        ],
      },
      {
        heading: 'Check-in and stay',
        bullets: [
          'A valid government-issued photo ID is required at check-in for every adult guest. Foreign nationals must present a passport and valid visa.',
          'Standard check-in and check-out times apply; early check-in and late check-out depend on availability and may carry a charge.',
          'Occupancy limits per room apply. Extra guests or beds may attract additional charges.',
          'Guests are responsible for any loss or damage to hotel property caused during their stay.',
        ],
      },
      {
        heading: 'Events and banquets',
        body: 'Banquet hall and outdoor event bookings are confirmed separately and may be subject to their own advance, minimum-guarantee, and cancellation terms, which we will share in writing at the time of booking.',
      },
      {
        heading: 'Use of this website',
        body: 'You agree not to misuse the site, attempt to disrupt it, or use its content for commercial purposes without our permission. Text, photographs, and branding on this site belong to the hotel or its licensors.',
      },
      {
        heading: 'Liability',
        body: 'We take reasonable care in operating the hotel and this website. We are not liable for indirect or consequential losses, or for matters outside our reasonable control, to the extent permitted by applicable law.',
      },
      {
        heading: 'Governing law',
        body: `These terms are governed by the laws of India, and the courts at Ballari, ${hotel.state} have jurisdiction over any dispute.`,
      },
    ],
  },

  cancellation: {
    id: 'cancellation',
    title: 'Cancellation Policy',
    updated: UPDATED,
    intro: 'How changes, cancellations, and refunds are handled. What applies to you depends on where you booked — free cancellation is available only on travel-platform rates that are sold with it, and never on bookings made directly with the hotel.',
    sections: [
      {
        heading: 'Booked on Goibibo or another travel platform',
        body: 'Some rates on these platforms are sold with free cancellation, and where your rate includes it, that benefit stands. The rate you selected sets the terms, including the deadline for cancelling free of charge. Cancellations and changes must be raised through the platform you booked on, not with the hotel.',
      },
      {
        heading: 'Booked directly with the hotel',
        body: 'Direct bookings are not offered on a free-cancellation basis. If your plans change, contact the front desk as early as you can and we will do our best to help — but a cancellation or amendment charge may apply, and refunds are not guaranteed.',
      },
      {
        heading: 'Talk to the front desk',
        body: `For any direct booking, the front desk handles cancellations, date changes, and refund questions. Call ${hotel.phoneDisplay} or email ${hotel.email} with your booking reference, guest name, and dates. Please put the request in writing wherever possible so there is a record of it.`,
      },
      {
        heading: 'What to expect on a direct booking',
        bullets: [
          'Cancellation and amendment charges are decided by the hotel case by case, taking into account how much notice you have given.',
          'No-shows and early departures are charged in full for the nights booked.',
          'Date changes are treated as amendments and depend on availability and current tariffs.',
          'Any advance paid may be retained in part or in full.',
        ],
      },
      {
        heading: 'Refunds',
        body: 'Where a refund is approved by the hotel, it is processed to the original payment method. Bank and payment-gateway timelines apply, and any taxes or partner fees are refunded in line with the applicable rules.',
      },
      {
        heading: 'Events and banquet bookings',
        body: 'Banquet, conference, and outdoor event bookings run on separate terms because of the advance planning involved. Advance amounts, minimum guarantees, and notice periods are agreed in writing when the booking is made.',
      },
      {
        heading: 'Circumstances beyond control',
        body: 'Where a stay cannot proceed because of events outside either party’s control, we will work with you in good faith on a date change or a fair resolution.',
      },
    ],
  },

  faq: {
    id: 'faq',
    title: 'Frequently Asked Questions',
    updated: UPDATED,
    intro: `Quick answers about staying at ${hotel.name}. If your question isn’t here, call us on ${hotel.phoneDisplay} — we are happy to help.`,
    sections: [
      {
        heading: 'Where exactly is the hotel?',
        body: `We are on ${hotel.shortAddress}. Bellary Junction Railway Station is roughly 1.3 km away, and the KSRTC bus station and city routes are close by.`,
      },
      {
        heading: 'How do I book a room?',
        body: 'You can book online through Goibibo using the booking link on this site, send us an enquiry through the form, message us on WhatsApp, or call the hotel directly. Direct bookings are confirmed by our team.',
      },
      {
        heading: 'Can I cancel or change my booking?',
        body: `It depends where you booked. Rates booked on Goibibo or another travel platform follow that rate’s terms — some are sold with free cancellation — and must be changed through the platform. Bookings made directly with the hotel do not include free cancellation: call the front desk on ${hotel.phoneDisplay} as early as possible, as a charge may apply.`,
      },
      {
        heading: 'What room types are available?',
        body: `We offer ${hotel.roomTypes.join(', ')}. All rooms are air-conditioned. Current tariffs are listed on the Rooms page.`,
      },
      {
        heading: 'Is parking available?',
        body: 'Yes — free on-site parking is available for guests, including space for larger vehicles during events.',
      },
      {
        heading: 'Is there a restaurant at the hotel?',
        body: 'Yes. We have an in-house restaurant and a lounge, with room service available for guests.',
      },
      {
        heading: 'Can I host a wedding or function here?',
        body: 'Yes. We have three banquet halls plus an outdoor event area, suitable for weddings, receptions, meetings, and private functions. Contact the team for availability, seating layouts, and menus.',
      },
      {
        heading: 'What do I need to bring for check-in?',
        body: 'A valid government-issued photo ID for each adult guest. Foreign nationals should carry a passport and valid visa.',
      },
      {
        heading: 'Do you accommodate families and business travellers?',
        body: 'Both. We have family-friendly rooms and suites, along with a business centre and conference facilities for work trips.',
      },
      {
        heading: 'Is the hotel accessible?',
        body: 'The property has an elevator and wheelchair support. Please tell us about any specific accessibility requirement when you book so we can prepare.',
      },
    ],
  },
};

export const legalDocOrder: LegalDocId[] = ['privacy', 'cookies', 'terms', 'cancellation', 'faq'];
