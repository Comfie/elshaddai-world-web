import { Instrument_Serif } from 'next/font/google';

/** Editorial display face for public-site headlines. Body/UI uses Geist (root layout). */
export const displayFont = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});
