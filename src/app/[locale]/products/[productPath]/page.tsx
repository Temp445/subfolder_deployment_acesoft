import type { Metadata } from 'next';
import ProductDetails from './productDetailsClient';
import { getProductByPath } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }: { params: Promise<{ productPath: string }> }) : Promise<Metadata> {
  const { productPath } = await params;

  const product = await getProductByPath(productPath);

  if (!product) {
    return {
      title: 'Products | Ace Software Solutions Pvt. Ltd',
      description: 'Explore powerful software solutions built for the manufacturing industry. Improve efficiency, streamline workflows, and ensure quality with our smart tools.',
    };
  }

  const description = `Discover how our ${product?.productName} helps manufacturers streamline operations, improve productivity, and ensure compliance. Explore features, benefits, and more.`;
  const title = `${product?.productName}`;
  const imageUrl = Array.isArray(product.imageUrl)
    ? `${apiUrl}/${product.imageUrl[0]}`
    : `${apiUrl}/${product.imageUrl}`;

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


export default function ProductDetailsPage() {
  return <ProductDetails />;
}
