'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import BlogProtectedRoute from '@/components/ProtectedRouteBlog';
import { useLocale } from 'next-intl';


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  _id: string;
  title: LocalizedString;
  author: string;
  description: LocalizedString;
  products: string;
  category?: LocalizedString;
  blogimage: string | string[];
  publishedAt?: string;
}

const productList = [
  'All',
  'ACE CMS',
  'ACE CRM',
  'ACE PMS',
  'ACE Project',
  'ACE Profit PPAP',
  'ACE TMS',
  'ACE FAM',
  'PPAP Manager',
  'ACE Profit ERP',
  'ACE Profit HRMS',
  'ACE Profit Payroll',
  'Engineering Balloon Annotator'
];


export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedProduct, setselectedProduct] = useState('All');
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = (text?: LocalizedString) => text?.[locale] ?? text?.en ?? "";

    useEffect(() => {
    fetchBlogs();
  }, []);

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blog`);

       const sorted = res.data.sort(
  (a: { publishedAt: any; createdAt: any; }, b: { publishedAt: any; createdAt: any; }) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
);

        setBlogs(sorted);
        setFilteredBlogs(res.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };


    const deleteBlog = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this Blog?")) {
      return;
    }
    try {
      await axios.delete(`${apiUrl}/api/blog/${id}`);
      alert("Blog deleted successfully!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedProduct === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((blog) => blog.products === selectedProduct));
    }
  }, [selectedProduct, blogs]);

  if (loading) {
    return(
         <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    )
    
  }

  return (
<BlogProtectedRoute>
       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-10">
 
      <div className="max-w-7xl mx-auto p-6 pt-12">
    <h1 className="text-4xl font-black mb-4">
            Blogs List
            </h1>
     <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

  <div className="relative w-full md:w-auto">
    <select
      id="product"
      value={selectedProduct}
      onChange={(e) => setselectedProduct(e.target.value)}
      className="w-full md:w-auto appearance-none bg-white/80 backdrop-blur-md border border-gray-300 rounded px-4 py-2 pr-12 text-base font-medium text-gray-800 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 cursor-pointer hover:bg-white"
    >
      {productList.map((product) => (
        <option key={product} value={product}>
          {product}
        </option>
      ))}
    </select>

    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
   <Link
    href="/blog-admin/blog-upload"
    className="inline-block px-4 py-2 text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-lg transition duration-300 text-base font-semibold"
  >
  Upload New Blog
  </Link>
</div>


        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No blogs found</h3>
            <p className="text-gray-500 text-lg">Try selecting a different category to see more content.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="group bg-white/70 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-white/20 hover:border-white/40 transform hover:-translate-y-2"
              style={{
               animationName: 'fadeIn',
               animationDuration: '2s',
               animationTimingFunction: 'ease-in-out',
               animationDelay: '0.5s',
             }}
              >
                <div className="relative overflow-hidden rounded-t-3xl h-64">

                      <img
                        src={`${apiUrl}/uploads/${blog.blogimage[0]}`}
                        alt= {blog.title && t(blog.title as LocalizedString)}
                        className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {/* {blog.title} */}
                    {blog.title && t(blog.title as LocalizedString)}
                  </h2>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600">By {blog.author}</span>
                    </div>
                    <span className="mx-2">|</span>
                    <span>
                      {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : ''}
                    </span>
                  </div>

          <div className='flex gap-4'>  
                  <Link
                    href={`/blog-admin/blog-edit/${blog._id}`}
                    className="inline-flex items-center group/btn  border text-black  px-4 py-1 hover:text-white hover:bg-amber-600 rounded text-sm font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300"
                  >
                    <span>Edit</span>
                  </Link>
                        
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="inline-flex items-center group/btn  border text-black hover:bg-red-600 hover:text-white  px-4 py-1 rounded text-sm font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300"
                  >
                    <span>Delete</span>
                  </button>
          </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
</BlogProtectedRoute>
  );
}
