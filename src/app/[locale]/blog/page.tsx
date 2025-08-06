import type { Metadata } from 'next';
import BlogListClient from './blogListClient';

const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

export const metadata: Metadata = {
  title: 'Blog | ACE Software Solutions',
  description: 'We provide smart business software solutions that help companies solve problems, adapt to changing needs, and grow faster.',
  openGraph: {
    title: 'About ACE Software Solutions',
    description: 'We provide smart business software solutions that help companies solve problems, adapt to changing needs, and grow faster.',
    url: `${domainUrl}/blog`,
    siteName: 'ACE Software Solutions',
    images: [
      {
        url: `${domainUrl}/og-images/AceLogo.png`, 
        width: 1200,
        height: 630,
        alt: 'Blog | ACE Software Solutions',
      },
    ],
    type: 'website',
  },
};

export default function AboutPage() {
  return <BlogListClient />;
}
