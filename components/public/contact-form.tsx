'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Field, FormShell, SubmitButton, inputClass } from '@/components/public/form-controls';

// ?topic= lets other pages deep-link into a pre-selected category.
const TOPIC_TO_CATEGORY: Record<string, string> = {
  visitor: 'VISITOR_INFO',
  prayer: 'PRAYER_REQUEST',
  partnership: 'PARTNERSHIP',
  media: 'MEDIA_INQUIRY',
  children: 'VISITOR_INFO',
};

export function ContactForm({
  defaults,
  heading = 'Send us a message',
  intro = 'We’ll get back to you as soon as we can.',
}: {
  /** Pre-selected values (URL params still win). */
  defaults?: { category?: string; subject?: string };
  heading?: string;
  intro?: string;
} = {}) {
  const params = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    subject: params.get('subject')?.slice(0, 200) ?? defaults?.subject ?? '',
    message: '',
    category: TOPIC_TO_CATEGORY[params.get('topic') ?? ''] ?? defaults?.category ?? 'GENERAL',
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Message sent successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'GENERAL',
        });
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormShell>
      <h2 className="display-md text-brand-navy">{heading}</h2>
      <p className="mt-3 text-body">{intro}</p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" required>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email address" required>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>

        <Field id="phone" label="Phone number">
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>

        <Field id="category" label="Category">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className={inputClass}
          >
            <option value="GENERAL">General Inquiry</option>
            <option value="PRAYER_REQUEST">Prayer Request</option>
            <option value="VISITOR_INFO">Visitor Information</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="MEDIA_INQUIRY">Media Inquiry</option>
            <option value="SUGGESTION">Suggestion</option>
            <option value="COMPLAINT">Complaint</option>
          </select>
        </Field>

        <Field id="subject" label="Subject" required className="sm:col-span-2">
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className={inputClass}
          />
        </Field>

        <Field id="message" label="Message" required hint="At least 10 characters." className="sm:col-span-2">
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
            minLength={10}
            disabled={isSubmitting}
            aria-describedby="message-hint"
            className={`${inputClass} resize-y`}
          />
        </Field>

        <div className="sm:col-span-2">
          <SubmitButton pending={isSubmitting} pendingLabel="Sending…">
            Send message
          </SubmitButton>
        </div>
      </form>
    </FormShell>
  );
}
