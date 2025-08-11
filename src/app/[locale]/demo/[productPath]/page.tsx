
import type { Metadata } from 'next';
import DemoClient from './demoClient';
import { getProductByPath } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

export async function generateMetadata({ params }: { params: Promise<{ productPath: string }> }) : Promise<Metadata> {
  const { productPath } = await params;

  const product = await getProductByPath(productPath);

  if (!product) {
    return {
      title: 'Book Free Demo | ACE Software Solutions Pvt. Ltd',
      description: 'Book a free demo of our smart manufacturing software solutions. See how our tools can streamline your operations, improve productivity, and transform your business.',

    };
  }

  const description = `Book a free demo of our ${product?.productName}. Discover how it can streamline your operations, boost productivity, and transform your business with smart, efficient solutions.`;
  const title = `Book Free demo | ${product?.productName}`;
  const imageUrl = Array.isArray(product.imageUrl)
    ? `${apiUrl}/${product.imageUrl[0]}`
    : '/og-images/AceLogo.png';


  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${domainUrl}/demo/${productPath}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      title,
      description,
      images: [{ url: imageUrl }],
    },
  };
}


export default function DemoPage() {
  return <DemoClient />;
}
