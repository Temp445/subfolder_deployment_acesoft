import type { Metadata } from 'next';
import AboutClient from './aboutClient';

export const metadata: Metadata = {
  title: 'About ACE Software Solution',
  description: 'We provide smart business software solutions that help companies solve problems, adapt to changing needs, and grow faster.',
};

export default function AboutPage() {
  return <AboutClient />;
}
