'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { inputClass } from '@/components/public/form-controls';

/** Password input with an accessible show/hide toggle. */
export function PasswordField({
  id,
  name,
  value,
  onChange,
  autoComplete,
  required = true,
  invalid,
  describedBy,
  minLength,
}: {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete: 'current-password' | 'new-password';
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  minLength?: number;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name ?? id}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        autoCapitalize="none"
        spellCheck={false}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${inputClass} pr-14`}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? 'Hide password' : 'Show password'}
        aria-pressed={shown}
        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-body transition-colors hover:text-brand-navy"
      >
        {shown ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
