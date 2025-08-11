
import type { Metadata } from 'next';
import BlogClient from './blogClient';
import { getBlogByPath } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 const domainUrl = process.env.NEXT_PUBLIC_API_FRONTEND_URL;

// generateMetadata with awaited params
export async function generateMetadata({ params }: { params: Promise<{ blogpath: string }> }) : Promise<Metadata>  {
 
  const { blogpath } = await params;
  const blog = await getBlogByPath(blogpath);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The blog you are looking for does not exist.',
    };
  }

  const title =  blog.metatitle || blog.products || 'Blog | Ace Software Solutions Pvt. Ltd';
  const description = blog.metadescription || blog.title?.en || '';
  const image = blog.blogimage?.[0]
    ? `${apiUrl}/uploads/${blog.blogimage[0]}`
    : '/og-images/AceLogo.png';

  return {
    title: `${title}`,
    description,
    openGraph: {
      title,
      description,
      url: `${domainUrl}/blog/${blogpath}`,
      images: [{ url: image }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}


export default function BlogPage() {
  return <BlogClient/>;
}

