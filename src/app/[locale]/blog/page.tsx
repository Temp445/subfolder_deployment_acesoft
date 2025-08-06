import type { Metadata } from 'next';
import BlogListClient from './blogListClient';

export const metadata: Metadata = {
  title: 'Blog | ACE Software Solution',
  description: 'We provide smart business software solutions that help companies solve problems, adapt to changing needs, and grow faster.',
};

export default function AboutPage() {
  return <BlogListClient />;
}
