'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHero } from '@/components/public/page-hero';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { Field, FormShell, SubmitButton, inputClass } from '@/components/public/form-controls';

export default function JoinPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    membershipType: 'VISITOR',
    notes: '',
  });

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
      const response = await fetch('/api/members/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success(data.message || 'Registration submitted successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(data.error || 'Failed to submit registration');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <PageHero
          variant={1}
          kicker="Welcome"
          title={
            <>
              Thank <em className="text-gold-light">you.</em>
            </>
          }
        />
        <section className="on-light section-y bg-ivory">
          <div className="wrap-narrow">
            <FormShell className="py-16 text-center">
              <div role="status" aria-live="polite">
                <CheckCircle2 className="mx-auto mb-6 size-12 text-bronze" aria-hidden="true" />
                <h2 className="display-md text-ink-900">Registration submitted.</h2>
                <p className="mx-auto mt-4 max-w-md text-stone-600">
                  Thank you for your interest in joining El Shaddai World Ministries. Your registration is being
                  reviewed by our team, and we will be in touch soon.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <CtaLink href="/" variant="outline-dark" arrow={false}>
                    Back to home
                  </CtaLink>
                  <CtaLink href="/contact" variant="dark">
                    Contact us
                  </CtaLink>
                </div>
              </div>
            </FormShell>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        variant={3}
        kicker="Join us"
        title={
          <>
            Become part of <em className="text-gold-light">our family.</em>
          </>
        }
        description="We are excited to welcome you to El Shaddai World Ministries. Complete the form below to get started."
      />

      <section className="on-light section-y bg-ivory">
        <div className="wrap-narrow">
          <Reveal>
            <FormShell>
              <h2 className="display-md text-ink-900">Membership registration</h2>
              <p className="mt-3 text-stone-600">Fields marked with an asterisk are required.</p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-12">
                <fieldset>
                  <legend className="kicker mb-6 text-bronze">About you</legend>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id="firstName" label="First name" required>
                      <input type="text" id="firstName" name="firstName" autoComplete="given-name" value={formData.firstName} onChange={handleChange} required className={inputClass} />
                    </Field>
                    <Field id="lastName" label="Last name" required>
                      <input type="text" id="lastName" name="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} required className={inputClass} />
                    </Field>
                    <Field id="email" label="Email address">
                      <input type="email" id="email" name="email" autoComplete="email" inputMode="email" value={formData.email} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field id="phone" label="Phone number" required>
                      <input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" value={formData.phone} onChange={handleChange} required className={inputClass} />
                    </Field>
                    <Field id="alternatePhone" label="Alternate phone">
                      <input type="tel" id="alternatePhone" name="alternatePhone" autoComplete="tel" inputMode="tel" value={formData.alternatePhone} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field id="dateOfBirth" label="Date of birth">
                      <input type="date" id="dateOfBirth" name="dateOfBirth" autoComplete="bday" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field id="gender" label="Gender">
                      <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                        <option value="">Select…</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </Field>
                    <Field id="maritalStatus" label="Marital status">
                      <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputClass}>
                        <option value="">Select…</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                      </select>
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="kicker mb-6 text-bronze">Address</legend>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id="address" label="Street address" className="sm:col-span-2">
                      <input type="text" id="address" name="address" autoComplete="street-address" value={formData.address} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field id="city" label="City">
                      <input type="text" id="city" name="city" autoComplete="address-level2" value={formData.city} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field id="province" label="Province">
                      <input type="text" id="province" name="province" autoComplete="address-level1" value={formData.province} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field id="postalCode" label="Postal code">
                      <input type="text" id="postalCode" name="postalCode" autoComplete="postal-code" inputMode="numeric" value={formData.postalCode} onChange={handleChange} className={inputClass} />
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="kicker mb-6 text-bronze">Your journey</legend>
                  <div className="grid gap-6">
                    <Field id="membershipType" label="I am joining as" required hint="Please select the option that best describes you.">
                      <select
                        id="membershipType"
                        name="membershipType"
                        value={formData.membershipType}
                        onChange={handleChange}
                        required
                        aria-describedby="membershipType-hint"
                        className={inputClass}
                      >
                        <option value="VISITOR">First-time Visitor</option>
                        <option value="NEW_CONVERT">New Convert</option>
                        <option value="MEMBER">Transferring Member</option>
                      </select>
                    </Field>
                    <Field id="notes" label="Additional information">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Tell us a bit about yourself, how you found us, or any questions you may have…"
                        className={`${inputClass} resize-y`}
                      />
                    </Field>
                  </div>
                </fieldset>

                <div>
                  <SubmitButton pending={isSubmitting} pendingLabel="Submitting registration…">
                    Submit registration
                  </SubmitButton>
                  <p className="mt-4 text-center text-sm text-stone-600">
                    By submitting this form, you agree to be contacted by El Shaddai World Ministries.
                  </p>
                </div>
              </form>
            </FormShell>
          </Reveal>
        </div>
      </section>
    </>
  );
}
