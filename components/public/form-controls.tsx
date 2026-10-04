import { cn } from '@/lib/utils';

/** Shared, accessible form primitives for the public forms (16px text so iOS doesn't zoom). */

export const inputClass =
  'block w-full min-h-12 rounded-xl border border-field bg-white px-4 py-3 text-base text-brand-navy placeholder:text-slate transition-colors focus:border-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-60';

export function Field({
  id,
  label,
  required,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-brand-navy">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-0.5 text-brand-700"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-body">
          {hint}
        </p>
      )}
    </div>
  );
}

export function CheckRow({
  id,
  name,
  checked,
  onChange,
  children,
  className,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={cn('flex min-h-11 cursor-pointer items-start gap-3 py-1.5', className)}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 size-5 shrink-0 cursor-pointer rounded border-field accent-brand-700"
      />
      <span className="text-[0.95rem] leading-snug text-brand-navy">{children}</span>
    </label>
  );
}

export function FormShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-brand-200 bg-white p-6 sm:p-10', className)}>{children}</div>
  );
}

export function SubmitButton({
  children,
  pending,
  pendingLabel,
  className,
}: {
  children: React.ReactNode;
  pending: boolean;
  pendingLabel: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-600 px-8 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
