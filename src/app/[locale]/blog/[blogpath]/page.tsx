
import type { Metadata } from 'next';
import BlogClient from './blogClient';
import { getBlogByPath } from '@/lib/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 
// generateMetadata with awaited params
export async function generateMetadata({ params }: { params: Promise<{ locale: string; blogpath: string }> }) : Promise<Metadata>  {
 
   const { locale, blogpath } = await params;
  
  const blog = await getBlogByPath(blogpath);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The blog you are looking for does not exist.',
    };
  }

  const title = blog.products || 'Ace Blog';
  const description = blog.description?.[locale] || blog.description?.en || '';
  const image = blog.blogimage?.[0]
    ? `${apiUrl}/uploads/${blog.blogimage[0]}`
    : '/default-og.jpg';

  return {
    title: ` Blog | ${title}`,
    description,
    openGraph: {
      title,
      description,
      url: `${apiUrl}/blog/${blogpath}`,
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

