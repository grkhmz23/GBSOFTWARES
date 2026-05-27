import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '@/components/icons';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10] bg-white overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-title-1 text-black">{t('privacy.title', 'privacy policy')}</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Close"
          >
            <CloseIcon color="#000000" size={24} />
          </button>
        </div>

        <div className="space-y-10 text-body text-black/80">
          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.effectiveDate', 'effective date')}</h2>
            <p>{t('privacy.effectiveDateText', 'this privacy policy is effective as of may 2025 and applies to the gb softwares website.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.overview', '1. overview')}</h2>
            <p>{t('privacy.overviewText', 'gb softwares ("we", "us", or "our") respects your privacy. this privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our contact form.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.collect', '2. information we collect')}</h2>
            <p className="mb-3">{t('privacy.collectIntro', 'we collect minimal information necessary to respond to inquiries and improve user experience:')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{t('privacy.contactInfo', 'contact information')}</strong> — {t('privacy.contactInfoText', 'name, email address, and project details submitted through the contact form.')}</li>
              <li><strong>{t('privacy.technicalData', 'technical data')}</strong> — {t('privacy.technicalDataText', 'ip address, browser type, device information, and pages visited (via standard server logs).')}</li>
              <li><strong>{t('privacy.localStorage', 'local storage data')}</strong> — {t('privacy.localStorageText', 'language preference and rate-limiting timestamps stored in your browser to prevent spam and remember your settings.')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.use', '3. how we use your information')}</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('privacy.use1', 'to respond to your inquiries and project requests')}</li>
              <li>{t('privacy.use2', 'to prevent spam and abuse through rate limiting')}</li>
              <li>{t('privacy.use3', 'to remember your language preference for future visits')}</li>
              <li>{t('privacy.use4', 'to analyze website traffic and improve user experience')}</li>
              <li>{t('privacy.use5', 'to comply with legal obligations')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.thirdParties', '4. third-party services')}</h2>
            <p className="mb-3">{t('privacy.thirdPartiesText', 'we use trusted third-party services to operate this website:')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>emailjs</strong> — {t('privacy.emailjs', 'used to deliver contact form submissions to our email inbox. data is processed according to their privacy policy.')}</li>
              <li><strong>vercel</strong> — {t('privacy.vercel', 'hosts this website and processes server logs. data is processed according to their privacy policy.')}</li>
              <li><strong>google fonts</strong> — {t('privacy.fonts', 'loads the inter typeface. google may collect usage data according to their privacy policy.')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.cookies', '5. cookies and local storage')}</h2>
            <p>{t('privacy.cookiesText', 'we do not use tracking cookies. we use browser local storage solely for: (a) remembering your selected language (english or french), and (b) enforcing rate limits on the contact form to prevent spam. you can clear this data at any time through your browser settings.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.retention', '6. data retention')}</h2>
            <p>{t('privacy.retentionText', 'contact form submissions are retained for as long as necessary to fulfill your request and maintain business records (typically up to 2 years). server logs are retained for 30 days. local storage data persists until you clear your browser cache.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.security', '7. data security')}</h2>
            <p>{t('privacy.securityText', 'we implement reasonable technical and organizational measures to protect your data, including input sanitization, rate limiting, honeypot spam protection, and https encryption. however, no method of transmission over the internet is 100% secure.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.rights', '8. your rights')}</h2>
            <p className="mb-3">{t('privacy.rightsText', 'depending on your jurisdiction, you may have the right to:')}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('privacy.right1', 'access the personal data we hold about you')}</li>
              <li>{t('privacy.right2', 'request correction or deletion of your data')}</li>
              <li>{t('privacy.right3', 'object to or restrict certain processing activities')}</li>
              <li>{t('privacy.right4', 'withdraw consent at any time')}</li>
            </ul>
            <p className="mt-3">{t('privacy.rightsContact', 'to exercise these rights, contact us using the information below.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.children', '9. children\'s privacy')}</h2>
            <p>{t('privacy.childrenText', 'our website is not directed to individuals under 16 years of age. we do not knowingly collect personal information from children.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.changes', '10. changes to this policy')}</h2>
            <p>{t('privacy.changesText', 'we may update this privacy policy from time to time. the updated version will be indicated by an updated effective date. we encourage you to review this policy periodically.')}</p>
          </section>

          <section>
            <h2 className="text-title-3 text-black font-semibold mb-3">{t('privacy.contact', '11. contact us')}</h2>
            <p>{t('privacy.contactText', 'if you have questions or concerns about this privacy policy, please contact us at:')}</p>
            <p className="mt-2">
              <a href="mailto:gorkhmazb23@gmail.com" className="text-blue hover:underline">
                gorkhmazb23@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray2/30 text-body-small text-black/50">
          <p>© {new Date().getFullYear()} gb softwares — gorkhmaz beydullayev. {t('privacy.allRights', 'all rights reserved.')}</p>
        </div>
      </div>
    </div>
  );
}
