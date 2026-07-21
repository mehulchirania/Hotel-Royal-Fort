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

export type LegalDocId = 'privacy' | 'terms' | 'cancellation' | 'faq';

const UPDATED = 'July 2026';

export const legalDocs: Record<LegalDocId, LegalDoc> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: UPDATED,
    intro: `This policy explains what information ${hotel.name}, ${hotel.city}, collects when you use this website or enquire about a stay, how we use it, and the choices you have.`,
    sections: [
      {
        heading: 'Information we collect',
        body: 'We only collect what we need to respond to an enquiry or host your stay:',
        bullets: [
          'Details you submit through the enquiry form — name, phone number, email address, dates of stay, room preference, and any message you write.',
          'Information you share when you call or message us on WhatsApp.',
          'Identity and address details required at check-in under applicable Indian hospitality regulations.',
          'Basic technical data such as pages visited and approximate location, used only to understand how the site is used.',
        ],
      },
      {
        heading: 'How we use your information',
        bullets: [
          'To respond to enquiries, confirm availability, and share tariffs.',
          'To manage your reservation, stay, and any event or banquet booking.',
          'To meet legal, tax, and guest-record obligations.',
          'To improve the website and the accuracy of the information we publish.',
        ],
      },
      {
        heading: 'What we do not do',
        bullets: [
          'We do not sell or rent your personal information to anyone.',
          'We do not send marketing messages unless you have asked us to.',
          'We do not collect payment card details on this website. Bookings made through Goibibo or any other travel partner are handled on their platform, under their privacy policy.',
        ],
      },
      {
        heading: 'Sharing with others',
        body: 'We share information only where it is necessary: with travel partners you chose to book through, with service providers who help us run the hotel, and with authorities where the law requires it.',
      },
      {
        heading: 'How long we keep it',
        body: 'Enquiry records are kept only as long as needed to follow up. Guest and billing records are retained for the period required by applicable law and tax rules.',
      },
      {
        heading: 'Your choices',
        body: `You can ask us to correct or delete the personal information we hold about you, or ask what we hold, by writing to ${hotel.email} or calling ${hotel.phoneDisplay}. We will respond within a reasonable time.`,
      },
      {
        heading: 'Contact us',
        body: `${hotel.name}, ${hotel.address}. Phone ${hotel.phoneDisplay}. Email ${hotel.email}.`,
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

export const legalDocOrder: LegalDocId[] = ['privacy', 'terms', 'cancellation', 'faq'];
