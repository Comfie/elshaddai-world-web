import { CtaLink } from '@/components/public/cta';
import { ImageTextSection } from '@/components/public/image-text-section';

/** Respectful, unhurried invitation to give. */
export function GivingCTA() {
  return (
    <ImageTextSection
      kicker="Giving"
      title={
        <>
          Generosity <em>changes</em> lives.
        </>
      }
      slot="giving"
      variant={4}
      reverse
      tone="light"
      cta={
        <CtaLink href="/give" variant="dark">
          Give online
        </CtaLink>
      }
    >
      <p>
        Every gift helps sustain our weekly services, nurture our ministries and extend God&rsquo;s love beyond our
        walls. Give as you feel led &mdash; we are grateful for every act of generosity.
      </p>
    </ImageTextSection>
  );
}
