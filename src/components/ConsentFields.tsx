import React from 'react';
import { usePrivacy } from '../context/privacy';

export interface ConsentState {
  consent: boolean;
  adult: boolean;
}

export const EMPTY_CONSENT: ConsentState = { consent: false, adult: false };

interface Props {
  idPrefix: string;
  value: ConsentState;
  onChange: (next: ConsentState) => void;
  /** Hidden bot trap — real guests never see or fill it. */
  website: string;
  onWebsiteChange: (value: string) => void;
}

/**
 * Consent block shared by every enquiry form: purpose notice, explicit
 * (unticked) consent, and the age / parental-permission declaration. Under
 * 18 the form must be filled in by a parent or guardian.
 */
export function ConsentFields({ idPrefix, value, onChange, website, onWebsiteChange }: Props) {
  const { openLegal } = usePrivacy();

  return (
    <fieldset className="space-y-3 text-left">
      <legend className="sr-only">Consent</legend>

      <p className="text-xs leading-relaxed text-gray-600">
        We use these details only to reply to your enquiry. See our{' '}
        <button
          type="button"
          onClick={() => openLegal('privacy')}
          className="font-medium text-maroon-800 underline hover:text-maroon-700"
        >
          Privacy Policy
        </button>
        .
      </p>

      <label htmlFor={`${idPrefix}-consent`} className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-700">
        <input
          id={`${idPrefix}-consent`}
          type="checkbox"
          required
          checked={value.consent}
          onChange={(e) => onChange({ ...value, consent: e.target.checked })}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-maroon-800"
        />
        <span>I agree that Hotel Royal Fort may use the details above to respond to this enquiry.</span>
      </label>

      <label htmlFor={`${idPrefix}-adult`} className="flex items-start gap-2.5 text-xs leading-relaxed text-gray-700">
        <input
          id={`${idPrefix}-adult`}
          type="checkbox"
          required
          checked={value.adult}
          onChange={(e) => onChange({ ...value, adult: e.target.checked })}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-maroon-800"
        />
        <span>
          I am 18 or older. If the guest is under 18, I am their parent or legal guardian and I give
          permission for their details to be used.
        </span>
      </label>

      {/* Honeypot: off-screen, not focusable, ignored by assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input
          id={`${idPrefix}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onWebsiteChange(e.target.value)}
        />
      </div>
    </fieldset>
  );
}
