import { cache } from 'react';
import { prisma } from '@/lib/db';
import { DEFAULT_CONTACT, FACEBOOK_URL, SITE_NAME } from '@/lib/site-config';

/**
 * Church facts shown across the public site.
 * Static defaults (lib/site-config.ts) are overridden by rows in the
 * `Settings` table — but only when the stored value is not one of the
 * known seed placeholders (e.g. "+27 XX XXX XXXX", "Church Address Here").
 */

export type SiteInfo = {
  name: string;
  email: string | null;
  phone: string | null;
  /** null until the church confirms its address (Settings: church_address). */
  addressLines: string[] | null;
  addressOneLine: string | null;
  /** Facebook is the verified official page; Instagram/YouTube stay hidden until real URLs are set. */
  social: { facebook: string | null; instagram: string | null; youtube: string | null };
  giving: {
    onlineUrl: string | null;
    bank: {
      bankName: string | null;
      accountName: string | null;
      accountNumber: string | null;
      branchCode: string | null;
    } | null;
  };
  /** Only generated when an address is confirmed — never guessed. */
  directionsUrl: string | null;
  mapEmbedUrl: string | null;
};

const PLACEHOLDER_PATTERNS = [
  /x{2,}/i, // +27 XX XXX XXXX
  /\bhere\b/i, // "Church Address Here"
  /123\s?456/, // 1234567890-style dummies
  /345\s?6789/,
  /(facebook|instagram|youtube)\.com\/elshaddai\/?$/i, // seeded demo social links
  /^\s*$/,
];

export const isPlaceholder = (value?: string | null) =>
  !value || PLACEHOLDER_PATTERNS.some((re) => re.test(value));

function clean(value?: string | null) {
  return isPlaceholder(value) ? null : value!.trim();
}

async function readSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.settings.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    // The site must still render if Settings can't be read.
    console.warn('[site-info] Could not read Settings, using defaults');
    return {};
  }
}

export const getSiteInfo = cache(async (): Promise<SiteInfo> => {
  const s = await readSettings();

  const settingsAddress = clean(s.church_address);
  const addressLines = settingsAddress
    ? settingsAddress.split(/\n|,\s*/).map((l) => l.trim()).filter(Boolean)
    : DEFAULT_CONTACT.addressLines;
  const addressOneLine = addressLines ? addressLines.join(', ') : null;

  const accountNumber = clean(s.bank_account_number);
  const bank = accountNumber
    ? {
        bankName: clean(s.bank_name),
        accountName: clean(s.bank_account_name) ?? SITE_NAME,
        accountNumber,
        branchCode: clean(s.bank_branch_code),
      }
    : null;

  const q = addressOneLine ? encodeURIComponent(addressOneLine) : null;

  return {
    name: clean(s.church_name) ?? SITE_NAME,
    email: clean(s.church_email) ?? DEFAULT_CONTACT.email,
    phone: clean(s.church_phone) ?? DEFAULT_CONTACT.phone,
    addressLines,
    addressOneLine,
    social: {
      facebook: clean(s.facebook_url) ?? FACEBOOK_URL,
      instagram: clean(s.instagram_url),
      youtube: clean(s.youtube_url),
    },
    giving: { onlineUrl: clean(s.give_online_url), bank },
    directionsUrl: q ? `https://www.google.com/maps/dir/?api=1&destination=${q}` : null,
    mapEmbedUrl: q ? `https://www.google.com/maps?q=${q}&output=embed` : null,
  };
});
