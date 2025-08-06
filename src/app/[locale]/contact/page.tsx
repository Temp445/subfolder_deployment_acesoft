import type { Metadata } from 'next';
import ContactClient from './contactClient';
const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

export const metadata: Metadata = {
  title: 'Contact Us | ACE Software Solutions',
  description: 'Contact ACE Software Solutions for expert support and custom software solutions in CRM, CMS, PPAP, and project management. Let us help grow your business.',
  openGraph: {
    title: 'Contact Us | ACE Software Solution',
    description: 'Contact ACE Software Solutions for expert support and custom software solutions in CRM, CMS, PPAP, and project management. Let us help grow your business.',
    url: `${domainUrl}/contact`,
    siteName: 'ACE Software Solutions',
    images: [
      {
        url: `${domainUrl}/og-images/AceLogo.png`,
        width: 1200,
        height: 630,
        alt: 'About ACE Software Solutions',
      },
    ],
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
