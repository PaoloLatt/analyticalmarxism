import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Analytical Marxism collects, uses, and protects your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-article mx-auto px-6 py-10 lg:py-12">
      <div className="mb-8">
        <p className="text-[0.7rem] font-sans font-semibold uppercase tracking-widest text-burgundy-600 mb-1">
          Legal
        </p>
        <h1 className="font-serif text-[2rem] font-bold text-charcoal mb-2">
          Privacy Policy
        </h1>
        <p className="text-small text-muted">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="prose prose-sm max-w-none text-[0.9375rem]">

        <h2>1. Who We Are</h2>
        <p>
          Analytical Marxism (<strong>analyticalmarxism.org</strong>) is an open educational project
          exploring Marxist questions with the tools of analytic philosophy, game theory, and social
          science. You can contact us at{' '}
          <a href="mailto:contact@analyticalmarxism.org">contact@analyticalmarxism.org</a>.
        </p>

        <h2>2. What Data We Collect</h2>
        <p>We collect minimal data. Specifically:</p>
        <ul>
          <li>
            <strong>Usage data</strong> (with your consent): pages visited, time on site, referrer
            URL, browser type and operating system — collected via Google Analytics 4 through
            Google Tag Manager.
          </li>
          <li>
            <strong>Cookie preferences</strong>: your consent choice is stored in a browser cookie
            called <code>cookie_consent</code> for 365 days. This is necessary data and does not
            require consent.
          </li>
        </ul>
        <p>
          We do not collect names, email addresses, or any other personally identifiable information
          unless you contact us directly.
        </p>

        <h2>3. Cookies</h2>
        <p>We use three categories of cookies:</p>

        <h3>Necessary (always active)</h3>
        <p>
          These cookies are required for the site to function and cannot be disabled.
        </p>
        <table>
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cookie_consent</code></td>
              <td>Stores your cookie preference choices</td>
              <td>365 days</td>
            </tr>
          </tbody>
        </table>

        <h3>Analytics (optional — requires consent)</h3>
        <p>
          When you accept analytics cookies, we load Google Tag Manager (GTM) which in turn
          activates Google Analytics 4 (GA4). GA4 collects anonymised usage data to help us
          understand how visitors use the site so we can improve it.
        </p>
        <table>
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td><code>_ga</code></td><td>Distinguishes unique users</td><td>2 years</td></tr>
            <tr><td><code>_ga_*</code></td><td>Stores session state</td><td>2 years</td></tr>
            <tr><td><code>_gid</code></td><td>Identifies user session</td><td>24 hours</td></tr>
          </tbody>
        </table>
        <p>
          For more information, see{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google&apos;s Privacy Policy
          </a>
          .
        </p>

        <h3>Social Media (optional — requires consent)</h3>
        <p>
          When you accept social media cookies, share buttons become active on blog and article
          pages. Clicking a share button will open the relevant platform in a new tab. Social
          platforms may set their own cookies when you interact with these features.
        </p>
        <p>
          Relevant platforms and their privacy policies:{' '}
          <a href="https://twitter.com/privacy" target="_blank" rel="noopener noreferrer">Twitter/X</a>,{' '}
          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Facebook</a>,{' '}
          <a href="https://linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>

        <h2>4. Google Analytics &amp; Tag Manager Disclosure</h2>
        <p>
          Google Analytics 4 is loaded exclusively through Google Tag Manager and only after you
          give consent. Data is processed by Google LLC and may be transferred to the United States.
          Google has certified compliance with applicable data transfer frameworks.
        </p>
        <p>
          We have enabled IP anonymisation in our GTM configuration. We do not share GA4 data with
          any third parties beyond Google.
        </p>

        <h2>5. How We Use Your Data</h2>
        <p>Analytics data is used solely to:</p>
        <ul>
          <li>Understand which content is most useful to visitors</li>
          <li>Identify technical issues (e.g. high bounce rates on specific pages)</li>
          <li>Inform decisions about future content priorities</li>
        </ul>
        <p>We do not use analytics data for advertising, profiling, or automated decision-making.</p>

        <h2>6. Data Retention</h2>
        <ul>
          <li><strong>Google Analytics data</strong>: retained for 14 months (GA4 default), then automatically deleted.</li>
          <li><strong>Cookie consent cookie</strong>: expires after 365 days.</li>
          <li><strong>Contact emails</strong>: retained as long as necessary to respond to your enquiry.</li>
        </ul>

        <h2>7. Your Rights (GDPR)</h2>
        <p>
          If you are in the European Economic Area, United Kingdom, or Switzerland, you have the
          following rights under the GDPR:
        </p>
        <ul>
          <li><strong>Right of access</strong>: request a copy of the data we hold about you.</li>
          <li><strong>Right to erasure</strong>: request deletion of your data.</li>
          <li><strong>Right to object</strong>: object to the processing of your data.</li>
          <li><strong>Right to restrict</strong>: request that we limit how we use your data.</li>
          <li><strong>Right to portability</strong>: receive your data in a machine-readable format.</li>
          <li><strong>Right to withdraw consent</strong>: change your cookie preferences at any time using the &ldquo;Cookie Settings&rdquo; link in the footer.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:contact@analyticalmarxism.org">contact@analyticalmarxism.org</a>. We will
          respond within 30 days.
        </p>

        <h2>8. Third-Party Links</h2>
        <p>
          Our site contains links to external resources (academic papers, books, other websites).
          We are not responsible for the privacy practices of those sites. We encourage you to
          review their policies.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. The date at the top of this page will
          reflect the most recent revision. Significant changes will be noted in the site&apos;s
          blog or changelog.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions about this policy? Email us at{' '}
          <a href="mailto:contact@analyticalmarxism.org">contact@analyticalmarxism.org</a>.
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-sand">
        <Link
          href="/"
          className="text-small text-burgundy-600 hover:text-burgundy-500 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
