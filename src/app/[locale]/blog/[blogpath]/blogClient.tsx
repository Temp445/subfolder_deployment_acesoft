'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { SimpleDisplay } from '@/components/tiptap-templates/simple/simple-display'
import Link from 'next/link'
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface LocalizedString {
  en: string;
  be?: string;
  br?: string;
  de?: string;
  es?: string;
  hi?: string;
  fr?: string;
  it?: string;
  ja?: string;
  kr?: string;
  ru?: string;
  zh?: string;
  [key: string]: string | undefined;
}

interface LocalizedContent {
  en: string;
  be?: string;
  br?: string;
  de?: string;
  es?: string;
  hi?: string;
  fr?: string;
  it?: string;
  ja?: string;
  kr?: string;
  ru?: string;
  zh?: string;
  [key: string]: any | undefined;
}

interface Blog {
  _id: string
  title: LocalizedString
  author: string
  description: LocalizedString
  category?: LocalizedString
  blogimage: string[]
  publishedAt?: string
  content: LocalizedContent
  products?: string;
}


export default function BlogClient (){
  const { blogpath } = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const locale = useLocale();
const t = (text?: LocalizedString) => text?.[locale] ?? text?.en ?? "";
const b = useTranslations('Blog');

  const getParsedContent = (raw: any) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return raw;
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blog/${blogpath}`)
        setBlog(res.data)
      } catch (err) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (blogpath) fetchBlog()
  }, [blogpath])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black" />
      </div>
    )
  }

  if (notFound || !blog) {
    return (
      <div className="text-center py-20 text-gray-600">
        <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
        <p>The blog you're looking for doesn’t exist or may have been removed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 xl:px-8">
      <div className="flex flex-col-reverse lg:flex-row gap-10 items-start">
      
        <div className="w-full lg:w-2/3">
          <h1 className="text-4xl font-bold mb-4 text-gray-900"> {blog.title && t(blog.title as LocalizedString)}</h1>

          <div className="text-gray-500 text-sm mb-6">
            By <span className="font-medium">{blog.author}</span> |{' '}
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Unpublished'}
          </div>

          <p className="text-lg text-gray-700 mb-6"> {blog.description && t(blog.description as LocalizedString)}</p>

          <div className="prose max-w-none">
               <SimpleDisplay
              content={getParsedContent(blog.content?.[locale] ?? blog.content?.en)}
              onContentChange={() => {}}
              editable={false}
            />
          </div>
        </div>

      
        <div className="lg:sticky top-3 right-2 w-full lg:w-1/3 mb-6 lg:mb-0 border rounded shadow-sm  bg-white">
          {blog.blogimage?.length > 0 && (
            <img
              src={`${apiUrl}/uploads/${blog.blogimage[0]}`}
              alt= {blog.title && t(blog.title as LocalizedString)}
              className="w-full h-[250px] md:h-[350px] object-cover rounded shadow-md"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 75% 100%, 25% 90%, 0 100%)',
              }}
            />
          )}

          <div className="mt-6 shadow-xl rounded-2xl overflow-hidden p-6 text-center bg-gradient-to-tr from-white to-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{b('BookFreeDemo')} </h2>
            <p className="text-gray-600 mb-6">
            {b('Discover')}
            </p>
            <Link
              href="/demo/all-products"
              className="inline-flex items-center justify-center border border-black hover:bg-black hover:text-white text-black font-medium px-5 py-2 rounded transition duration-300"
            >
             {b('BookNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
