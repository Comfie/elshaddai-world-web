'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { CheckRow, Field, FormShell, SubmitButton, inputClass } from '@/components/public/form-controls';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  isAnonymous: false,
  category: 'GENERAL',
  request: '',
  isUrgent: false,
  isPublic: false,
  shareWithPastors: true,
  shareWithLeaders: false,
};

const reassurance = [
  { title: 'We care', body: 'Your request matters to us. Our prayer team is committed to praying for you.' },
  { title: 'Confidential', body: 'Your privacy is important. Choose to submit anonymously or privately.' },
  { title: 'Community', body: 'Join our church family in prayer. You may optionally share with the prayer wall.' },
];

export default function PrayerRequestsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // The API validates optional strings strictly (e.g. email must be a valid
    // address *if present*), so blank optional fields are omitted rather than
    // sent as "". Anonymous requests send no personal details at all.
    const payload: Record<string, unknown> = { ...formData };
    for (const key of ['name', 'email', 'phone'] as const) {
      if (formData.isAnonymous || formData[key].trim() === '') delete payload[key];
    }

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Prayer request submitted successfully!');
        setFormData(initialForm);
        setSubmitted(true);
      } else {
        toast.error(data.error || 'Failed to submit prayer request');
      }
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        variant={4}
        kicker="Prayer"
        title={
          <>
            How can we <em className="text-brand-300">pray</em> for you?
          </>
        }
        description="“The prayer of a righteous person is powerful and effective.” — James 5:16"
      />

      <section className="on-light section-y bg-brand-50">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <p className="kicker mb-6 text-brand-700">You are not alone</p>
            <ul className="divide-y divide-brand-200 border-y border-brand-200">
              {reassurance.map((r) => (
                <li key={r.title} className="py-6">
                  <p className="display-sm text-brand-navy">{r.title}</p>
                  <p className="mt-2 text-body">{r.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={100}>
            {submitted ? (
              <FormShell className="py-16 text-center" >
                <div role="status" aria-live="polite">
                  <CheckCircle2 className="mx-auto mb-6 size-12 text-brand-700" aria-hidden="true" />
                  <h2 className="display-md text-brand-navy">We are praying with you.</h2>
                  <p className="mx-auto mt-4 max-w-md text-body">
                    Thank you for sharing. Your request has been received by our prayer team.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="inline-flex min-h-12 items-center rounded-lg border border-brand-700 px-7 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-700 hover:bg-brand-700 hover:text-white"
                    >
                      Submit another
                    </button>
                    <CtaLink href="/visit" variant="primary">
                      Plan your visit
                    </CtaLink>
                  </div>
                </div>
              </FormShell>
            ) : (
              <FormShell>
                <h2 className="display-md text-brand-navy">Submit your request</h2>
                <p className="mt-3 text-body">
                  All fields are optional except your prayer request.
                </p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                  <CheckRow
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="rounded-xl bg-brand-100 px-4 py-3"
                  >
                    Submit anonymously (your personal information will not be collected)
                  </CheckRow>

                  {!formData.isAnonymous && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id="name" label="Your name" className="sm:col-span-2">
                        <input id="name" name="name" type="text" autoComplete="name" value={formData.name} onChange={handleChange} className={inputClass} />
                      </Field>
                      <Field id="email" label="Email address">
                        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={formData.email} onChange={handleChange} className={inputClass} />
                      </Field>
                      <Field id="phone" label="Phone number">
                        <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={formData.phone} onChange={handleChange} className={inputClass} />
                      </Field>
                    </div>
                  )}

                  <Field id="category" label="Prayer category">
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                      <option value="GENERAL">General</option>
                      <option value="HEALTH">Health/Healing</option>
                      <option value="FAMILY">Family</option>
                      <option value="FINANCIAL">Financial</option>
                      <option value="EMPLOYMENT">Employment</option>
                      <option value="SPIRITUAL">Spiritual Growth</option>
                      <option value="SALVATION">Salvation</option>
                      <option value="DIRECTION">Guidance/Direction</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </Field>

                  <Field id="request" label="Your prayer request" required hint="Share what you would like us to pray about (at least 10 characters).">
                    <textarea
                      id="request"
                      name="request"
                      rows={6}
                      value={formData.request}
                      onChange={handleChange}
                      required
                      minLength={10}
                      aria-describedby="request-hint"
                      className={`${inputClass} resize-y`}
                    />
                  </Field>

                  <fieldset className="border-t border-brand-200 pt-6">
                    <legend className="kicker mb-3 text-brand-700">Sharing options</legend>
                    <CheckRow id="isUrgent" name="isUrgent" checked={formData.isUrgent} onChange={handleChange}>
                      This is an urgent prayer request
                    </CheckRow>
                    <CheckRow id="isPublic" name="isPublic" checked={formData.isPublic} onChange={handleChange}>
                      Share on public prayer wall (others can pray for this request)
                    </CheckRow>
                    <CheckRow id="shareWithPastors" name="shareWithPastors" checked={formData.shareWithPastors} onChange={handleChange}>
                      Share with pastoral team (recommended)
                    </CheckRow>
                    <CheckRow id="shareWithLeaders" name="shareWithLeaders" checked={formData.shareWithLeaders} onChange={handleChange}>
                      Share with ministry leaders
                    </CheckRow>
                  </fieldset>

                  <SubmitButton pending={isSubmitting} pendingLabel="Submitting…">
                    Submit prayer request
                  </SubmitButton>
                </form>
              </FormShell>
            )}
          </Reveal>
        </div>
      </section>

      <section className="on-light bg-brand-100 py-20 text-center">
        <div className="wrap-narrow">
          <p className="display-sm text-brand-navy sm:text-[1.75rem]">
            &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with
            thanksgiving, present your requests to God.&rdquo;
          </p>
          <p className="kicker mt-6 text-brand-700">Philippians 4:6</p>
        </div>
      </section>
    </>
  );
}
