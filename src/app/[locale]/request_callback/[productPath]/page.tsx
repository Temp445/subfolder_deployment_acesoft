import type { Metadata } from 'next';
import RequestCallback from './requestClient';
import { getProductByPath } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }: { params: Promise<{ productPath: string }> }) : Promise<Metadata> {
  const { productPath } = await params;

  const product = await getProductByPath(productPath);

  if (!product) {
    return {
      title: 'Contact Us | Request Callback | Ace Software Solutions Pvt. Ltd',
      description: 'Contact us to find the right solution for your business. Our team will respond promptly to assist you with your enquiry.', 
      
    };
  }

  const description = `Contact us to learn more about ${product?.productName} . Our team is ready to answer your questions and help you choose the best solution for your needs.`;
  const title = `${product?.productName}`;
  const imageUrl = Array.isArray(product.imageUrl)
    ? `${apiUrl}/${product.imageUrl[0]}`
    : '/og-images/AceLogo.png';


  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${apiUrl}/products/${productPath}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      title,
      description,
      images: [{ url: imageUrl }],
    },
  };
}


export default function RequestCallbackPage() {
  return <RequestCallback />;
}
