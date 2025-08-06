import type { Metadata } from 'next';
import ProductsClient from './productsClient';

export const metadata: Metadata = {
  title: 'All Products | ACE Software Solution',
  description: 'Explore a wide range of business software solutions from ACE Software Solutions, designed to streamline operations, improve productivity, and drive business growth.',
};

export default function ProductsPage() {
  return <ProductsClient />;
}
