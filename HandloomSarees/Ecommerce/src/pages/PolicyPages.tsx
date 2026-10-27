import { Link } from 'react-router-dom';

const SUPPORT_EMAIL = 'admin@neygecouture.com';
const SUPPORT_PHONE = '+91-9113991711';
const BUSINESS_ADDRESS = 'Gadag, Karnataka, India - 582103';
const CANONICAL_DOMAIN = 'https://www.neygecouture.com';

const CSS = `
.policy-root {
  background: linear-gradient(180deg, #fff9f0 0%, #f8eee2 100%);
  color: #2b1a16;
  min-height: 100vh;
  padding: 72px 20px;
}
.policy-shell {
  max-width: 980px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(128, 0, 32, 0.14);
  box-shadow: 0 24px 80px rgba(54, 20, 20, 0.08);
  padding: 42px;
}
.policy-kicker {
  color: #800020;
  font-size: 12px;
  letter-spacing: .22em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.policy-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(34px, 5vw, 58px);
  line-height: 1.05;
  margin-bottom: 14px;
}
.policy-updated {
  color: #72594a;
  margin-bottom: 30px;
}
.policy-section {
  margin-top: 28px;
}
.policy-section h2 {
  color: #800020;
  font-size: 22px;
  margin-bottom: 10px;
}
.policy-section p,
.policy-section li {
  color: #4a3828;
  font-size: 16px;
  line-height: 1.75;
}
.policy-section ul {
  padding-left: 22px;
}
.policy-contact-card {
  background: #fff9f0;
  border: 1px solid rgba(196, 152, 10, .3);
  padding: 18px;
  margin-top: 18px;
}
.policy-link {
  color: #800020;
  text-decoration: underline;
}
@media (max-width: 640px) {
  .policy-root { padding: 42px 14px; }
  .policy-shell { padding: 28px 20px; }
}
`;

type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PolicyDocument = {
  title: string;
  updated: string;
  sections: PolicySection[];
};

const policies: Record<string, PolicyDocument> = {
  terms: {
    title: 'Terms and Conditions',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Use of the website',
        paragraphs: [
          'Neyge Couture offers handloom sarees and related services through this website. By using the website or placing an order, you agree to provide accurate information and use the service only for lawful personal or business purchases.',
        ],
      },
      {
        heading: 'Orders, pricing, and availability',
        paragraphs: [
          'Product prices are shown in INR and may change before checkout. Orders are accepted subject to product availability, payment confirmation, delivery serviceability, and fraud/risk checks.',
        ],
      },
      {
        heading: 'Payments',
        paragraphs: [
          'Online payments are processed through Razorpay when enabled for the active environment. We do not store full card, UPI, or bank credentials on Neyge Couture servers.',
        ],
      },
      {
        heading: 'Custom services',
        paragraphs: [
          'Custom blouse stitching, fall, pico, inskirt, or similar add-on services may require additional details and may have separate cancellation or return limitations once work has started.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Information we collect',
        bullets: [
          'Account, contact, shipping, and order information needed to process purchases.',
          'Payment status and transaction reference data returned by Razorpay.',
          'Support messages received through WhatsApp, Instagram, website forms, email, or phone.',
        ],
      },
      {
        heading: 'How we use information',
        bullets: [
          'To process orders, payments, delivery, returns, refunds, and support requests.',
          'To detect fraud, protect customer accounts, and comply with legal or platform obligations.',
          'To improve the website and customer experience.',
        ],
      },
      {
        heading: 'Data sharing',
        paragraphs: [
          'We share information only with service providers required for payment, delivery, hosting, analytics, support, compliance, or legal obligations. We do not sell customer personal information.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Delivery coverage',
        paragraphs: [
          'We currently support shipping within India, subject to courier serviceability for the delivery PIN code.',
        ],
      },
      {
        heading: 'Processing and delivery timelines',
        bullets: [
          'Ready-to-ship items are usually processed after payment confirmation.',
          'Custom stitching or finishing add-ons can add processing time.',
          'Delivery timelines depend on location, courier operations, holidays, and weather disruptions.',
        ],
      },
      {
        heading: 'Shipping charges',
        paragraphs: [
          'Shipping charges, if applicable, are shown during checkout before payment. Free-shipping thresholds may change by campaign or order value.',
        ],
      },
    ],
  },
  cancellationRefund: {
    title: 'Cancellation and Refund Policy',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Cancellations',
        paragraphs: [
          'Cancellation requests should be raised as soon as possible. Orders that are already shipped or custom work that has started may not be cancellable.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: [
          'Approved refunds are processed back to the original payment method through the payment provider. Bank or payment-provider timelines may apply after the refund is initiated.',
        ],
      },
      {
        heading: 'Damaged or incorrect items',
        paragraphs: [
          'If you receive a damaged or incorrect item, contact us promptly with order details and clear photos so the support team can validate replacement, return, or refund eligibility.',
        ],
      },
    ],
  },
  returns: {
    title: 'Returns Policy',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Eligibility',
        bullets: [
          'Return requests must include the order ID and reason for return.',
          'Items must be unused, undamaged, and returned with original packaging wherever applicable.',
          'Custom-stitched or altered products may be non-returnable unless defective or incorrectly fulfilled.',
        ],
      },
      {
        heading: 'How to request a return',
        paragraphs: [
          `Contact ${SUPPORT_EMAIL} or ${SUPPORT_PHONE} with your order ID. Our team will confirm eligibility and next steps before any reverse pickup or refund is initiated.`,
        ],
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Customer support',
        paragraphs: [
          `Email: ${SUPPORT_EMAIL}`,
          `Phone / WhatsApp: ${SUPPORT_PHONE}`,
          `Address: ${BUSINESS_ADDRESS}`,
        ],
      },
      {
        heading: 'Order help',
        paragraphs: [
          'For order, payment, shipping, return, or refund questions, include your order ID and the phone or email used during checkout.',
        ],
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Are payments live?',
        paragraphs: [
          'Payments are available only when the active deployment environment has payments enabled and valid Razorpay credentials configured.',
        ],
      },
      {
        heading: 'How do I track an order?',
        paragraphs: [
          'Use your account order history or contact support with your order ID. Public tracking availability depends on courier integration status.',
        ],
      },
      {
        heading: 'Can I request custom stitching?',
        paragraphs: [
          'Where available, blouse stitching or finishing services can be requested from the product or checkout flow, or by contacting support.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Cookie usage',
        paragraphs: [
          'The website may use essential cookies or browser storage for login sessions, cart behavior, preferences, and basic site operation.',
        ],
      },
      {
        heading: 'Third-party services',
        paragraphs: [
          'Payment, hosting, analytics, or support tools may set their own cookies or collect technical data according to their policies.',
        ],
      },
    ],
  },
  track: {
    title: 'Track Your Order',
    updated: 'Last updated: September 4, 2026',
    sections: [
      {
        heading: 'Tracking options',
        bullets: [
          'Log in and check your profile/order history for the latest status.',
          `Contact support at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE} with your order ID.`,
          'Courier tracking links are shown when a shipment tracking ID is available.',
        ],
      },
    ],
  },
};

function PolicyPage({ document }: { document: PolicyDocument }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="policy-root">
        <article className="policy-shell">
          <div className="policy-kicker">Neyge Couture</div>
          <h1 className="policy-title">{document.title}</h1>
          <p className="policy-updated">{document.updated}</p>

          {document.sections.map((section) => (
            <section className="policy-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="policy-contact-card">
            Need help? Contact us at{' '}
            <a className="policy-link" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>{' '}
            or{' '}
            <a className="policy-link" href={`tel:${SUPPORT_PHONE}`}>
              {SUPPORT_PHONE}
            </a>
            . Visit{' '}
            <a className="policy-link" href={CANONICAL_DOMAIN}>
              {CANONICAL_DOMAIN}
            </a>
            .
          </div>

          <p className="policy-section">
            <Link className="policy-link" to="/">
              Back to home
            </Link>
          </p>
        </article>
      </div>
    </>
  );
}

export const TermsPage = () => <PolicyPage document={policies.terms} />;
export const PrivacyPage = () => <PolicyPage document={policies.privacy} />;
export const ShippingPage = () => <PolicyPage document={policies.shipping} />;
export const CancellationRefundPage = () => <PolicyPage document={policies.cancellationRefund} />;
export const ReturnsPage = () => <PolicyPage document={policies.returns} />;
export const ContactPage = () => <PolicyPage document={policies.contact} />;
export const FaqPage = () => <PolicyPage document={policies.faq} />;
export const CookiesPage = () => <PolicyPage document={policies.cookies} />;
export const TrackPage = () => <PolicyPage document={policies.track} />;
