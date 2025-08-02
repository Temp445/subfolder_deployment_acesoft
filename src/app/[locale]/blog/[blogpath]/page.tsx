'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { SimpleDisplay } from '@/components/tiptap-templates/simple/simple-display'
import Link from 'next/link'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface Blog {
  _id: string
  title: string
  author: string
  description: string
  category?: string
  blogimage: string[]
  publishedAt?: string
  content: any
}

export default function BlogDetailPage() {
  const { blogpath } = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blog/${blogpath}`)
        setBlog(res.data)
      } catch (err) {
        console.error('Error fetching blog:', err)
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
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>

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

          <p className="text-lg text-gray-700 mb-6">{blog.description}</p>

          <div className="prose max-w-none">
            <SimpleDisplay content={blog.content} onContentChange={() => {}} editable={false} />
          </div>
        </div>

      
        <div className="lg:sticky top-3 right-2 w-full lg:w-1/3 mb-6 lg:mb-0 border rounded shadow-sm  bg-white">
          {blog.blogimage?.length > 0 && (
            <img
              src={`${apiUrl}/uploads/${blog.blogimage[0]}`}
              alt={blog.title}
              className="w-full h-[250px] md:h-[350px] object-cover rounded shadow-md"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 75% 100%, 25% 90%, 0 100%)',
              }}
            />
          )}

          <div className="mt-6 shadow-xl rounded-2xl overflow-hidden p-6 text-center bg-gradient-to-tr from-white to-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Book a Free Demo</h2>
            <p className="text-gray-600 mb-6">
              Discover how our solution can transform your workflow. Get a personalized walkthrough tailored to your business.
            </p>
            <Link
              href="/demo/all-products"
              className="inline-flex items-center justify-center border border-black hover:bg-black hover:text-white text-black font-medium px-5 py-2 rounded transition duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
