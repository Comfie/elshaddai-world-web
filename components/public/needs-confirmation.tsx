/**
 * Marks content that administrators still need to confirm. Invisible to the
 * public in production; shows an amber tag in development/preview builds so
 * nothing slips through unnoticed. See docs/public-site-redesign.md.
 */
export function NeedsConfirmation({ what }: { what: string }) {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    <span
      data-needs-confirmation={what}
      className="ml-2 inline-block rounded border border-amber-500/60 bg-amber-100 px-1.5 py-0.5 align-middle text-[0.65rem] font-semibold uppercase tracking-wider text-amber-900"
    >
      Needs confirmation: {what}
    </span>
  );
}
