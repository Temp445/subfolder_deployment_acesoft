import type { Metadata } from 'next';
import ContactClient from './contactClient';

export const metadata: Metadata = {
  title: 'Contact Us | ACE Software Solution',
  description: 'Contact ACE Software Solutions for expert support and custom software solutions in CRM, CMS, PPAP, and project management. Let us help grow your business.',
};

export default function ContactPage() {
  return <ContactClient />;
}
