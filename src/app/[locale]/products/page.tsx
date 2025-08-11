import type { Metadata } from 'next';
import ProductsClient from './productsClient';

const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

export const metadata: Metadata = {
  title: 'All Products | ACE Software Solutions Pvt. Ltd',
  description: 'Explore a wide range of business software solutions from ACE Software Solutions, designed to streamline operations, improve productivity, and drive business growth.',
  openGraph: {
    title: 'All Products | ACE Software Solutions Pvt. Ltd',
    description: 'Explore a wide range of business software solutions from ACE Software Solutions, designed to streamline operations, improve productivity, and drive business growth.',
    url: `${domainUrl}/products`, 
    siteName: 'ACE Software Solutions Pvt. Ltd',
    images: [
      {
        url: `${domainUrl}/og-images/AceLogo.png`,
        width: 1200,
        height: 630,
        alt: 'ACE Software Solutions Pvt. Ltd',
      },
    ],
    type: 'website',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
