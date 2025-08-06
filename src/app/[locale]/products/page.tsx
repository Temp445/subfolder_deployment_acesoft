import type { Metadata } from 'next';
import ProductsClient from './productsClient';

const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

export const metadata: Metadata = {
  title: 'All Products | ACE Software Solution',
  description: 'Explore a wide range of business software solutions from ACE Software Solutions, designed to streamline operations, improve productivity, and drive business growth.',
  openGraph: {
    title: 'All Products | ACE Software Solution',
    description: 'Explore a wide range of business software solutions from ACE Software Solutions, designed to streamline operations, improve productivity, and drive business growth.',
    url: `${domainUrl}/products`, 
    siteName: 'ACE Software Solutions',
    images: [
      {
        url: `${domainUrl}/og-images/AceLogo.png`,
        width: 1200,
        height: 630,
        alt: 'All Products | ACE Software Solutions',
      },
    ],
    type: 'website',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
