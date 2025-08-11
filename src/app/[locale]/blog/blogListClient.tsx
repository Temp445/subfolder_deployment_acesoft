'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ArrowRight, Sparkles, Users, Clock, CheckCircle, MoveRight } from 'lucide-react';

import image1 from "@/assets/Images/blogimage1.png";
import image3 from "@/assets/Images/blogimage3.jpg";
import image4 from "@/assets/Images/blogimage4.jpg";
import image5 from "@/assets/Images/blogimage5.jpg";
import { useTranslations } from "next-intl";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface LocalizedString {
  [key: string]: string | undefined;
}

interface Blog {
  _id: string;
  title: LocalizedString;
  blogpath: string;
  author: string;
  description: LocalizedString;
  products?: string;
  category?: LocalizedString;
  blogimage: string[];
  publishedAt?: string;
  createdAt?: string;
}

const productColorMap: Record<string, string> = {
  'ACE CMS': 'bg-sky-100 text-sky-600',
  'ACE CRM': 'bg-red-100 text-red-600',
  'ACE PMS': 'bg-pink-100 text-pink-600',
  'ACE Project': 'bg-purple-100 text-purple-600',
  'ACE Profit PPAP': 'bg-yellow-100 text-yellow-600',
  'ACE TMS': 'bg-blue-100 text-blue-600',
  'ACE FAM': 'bg-indigo-100 text-indigo-600',
  'PPAP Manager': 'bg-teal-100 text-teal-600',
  'ACE Profit ERP': 'bg-amber-100 text-amber-600',
  'ACE Profit HRMS': 'bg-cyan-100 text-cyan-600',
  'ACE Profit Payroll': 'bg-rose-100 text-rose-600',
  'Engineering Balloon Annotator': 'bg-lime-100 text-lime-600',
  Default: 'bg-gray-100 text-gray-600',
};



export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const locale = useLocale();
  const b = useTranslations('Blog');

  const t = (text?: LocalizedString) => text?.[locale] ?? text?.en ?? '';

  const getUniqueCategories = (blogs: Blog[]) => {
    const categories = new Set<string>();
    blogs.forEach((blog) => {
      const cat = t(blog.category);
      if (cat) categories.add(cat);
    });
    return ['All', ...Array.from(categories)];
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/blog`);
        const allBlogs: Blog[] = res.data;

        const sorted = [...allBlogs].sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt || '').getTime() -
            new Date(a.publishedAt || a.createdAt || '').getTime()
        );

        setBlogs(sorted);
        setFilteredBlogs(sorted);
        setLatestBlogs(sorted.slice(0, 4));
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((blog) => t(blog.category) === selectedCategory));
    }
  }, [selectedCategory, blogs]);

  const categories = getUniqueCategories(blogs);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-slate-50 via-sky-200 to-indigo-50 container mx-auto pb-32">
<section className="relative bg-indigo-500 text-white overflow-hidden">
 
  <div className="absolute inset-0 z-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <span
        key={i}
        className="absolute w-1.5 h-1.5 bg-white/50 rounded-full animate-[floatParticles_6s_ease-in-out_infinite]"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${4 + Math.random() * 4}s`,
          animationDelay: `${Math.random() * 4}s`,
          opacity: Math.random() * 0.6 + 0.2,
        }}
      ></span>
    ))}
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 max-w-4xl">
        {b('title')}
      </h1>
      <p className="text-lg sm:text-xl max-w-xl text-gray-100 mx-auto md:mx-0">
       {b('para')}
      </p>
    </div>
  </div>


  <div className="relative z-10 max-w-7xl mx-auto px-6 hidden md:block">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          title: b('cardtitle1'),
          content: b('cardcontent1'),
        },
        {
          title: b('cardtitle2'),
          content: b('cardcontent2'),
        },
        {
          title: b('cardtitle3'),
          content: b('cardcontent3'),
        },
      ].map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-t-2xl p-6 text-gray-900 shadow-md hover:shadow-xl transition backdrop-blur-lg"
        >
          <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
          <p className="text-sm text-gray-600">{card.content}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* product section */}

<section className="bg-gray-50 py-20 px-4">
 <div className=" mx-auto">
<h2 className='text-4xl max-w-xl pb-5'>{b('product')}</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  {[
  {
    title: 'ACE CMS',
    description: b('productdec1'),
    image: image1,
    link: '/products/ace-calibration-management-system',
  },
  {
    title: 'ACE CRM',
    description: b('productdec2'),
    image: image5,
    link: '/products/ace-customer-relationship-management-system',
  },
  {
    title: 'ACE Project',
    description: b('productdec3'),
    image: image4,
    link: '/products/ace-project-management-software',
  },
  {
    title: 'ACE PPAP',
    description: b('productdec4'),
    image: image3,
    link: '/products/ace-profit-ppap',
  },
].map((item, i) => (
            <div key={i} className="relative group rounded overflow-hidden shadow-2xl shadow-gray-500 p-1">

<Link href={item.link}>
    <Image
      src={item.image}
      alt={item.title}
      width={400}
      height={300}
      className="w-full h-80 object-center rounded transition-transform duration-500 group-hover:scale-105 "
    />
</Link>

  <div className={`absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4`} >

  <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
  <p className="text-sm">{item.description}</p>
</div>
</div>
          ))}
        </div>
      </div>
    </section>

    {/* latest blog section */}
    <section>
         <div className="relative w-fit pr-12 h-16 mb-5 bg-blue-500 [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)] text-3xl font-bold text-white flex pl-3 items-center text-center shadow-lg shadow-indigo-500/40">
      {b('LatestBlogs')}
     </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-4 lg:px-0 lg:ml-5">
                 <div className="row-span-2">
                <div className="h-full md:h-fit xl:h-full  bg-white/70 rounded shadow-xl p-4 flex flex-col hover:shadow-2xl transition ">
                  <img
                    src={`${apiUrl}/uploads/${latestBlogs[0].blogimage[0]}`}
                    alt={t(latestBlogs[0].title)}
                    className="w-full h-64 object-cover rounded-lg mb-4 clip-path:polygon(0_0,100%_0,100%_80%,0_100%)]"
                  />
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{t(latestBlogs[0].title)}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mt-2 ">{t(latestBlogs[0].description)}</p>
                  <Link
                    href={`/blog/${latestBlogs[0].blogpath}`}
                    className="mt-auto text-sm text-blue-600 hover:underline font-medium flex"
                  >
                    {b('ReadMore')} <MoveRight className='h-4 w-8 mt-0.5 -ml-1'/>
                  </Link>
                </div>
              </div>


              <div className="flex flex-col gap-2  md:hidden xl:flex">
                {latestBlogs.slice(1, 3).map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white/70 rounded shadow-xl p-2 hover:shadow-2xl transition"
                  >
            <div className="flex flex-col hfull md:flex-row hover:bg-yellow-300 rounded p-4 hover:shadow-2xl transition gap-4 group ">
            
              <div className="w-full md:w-2/5 overflow-hidden rounded-lg flex-shrink-0">
                <img
                  src={`${apiUrl}/uploads/${blog.blogimage[0]}`}
                  alt={blog.title && t(blog.title as LocalizedString)}

                  className="w-full h-full max-h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            
              <div className="w-full md:w-3/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">{blog.title && t(blog.title as LocalizedString)}</h3>
                  <p className="text-gray-600 text-sm line-clamp-4">{blog.description && t(blog.description as LocalizedString)}</p>
                </div>
                <Link
                  href={`/blog/${blog.blogpath}`}
                  className="mt-4 text-sm text-red-600  font-medium flex "
                >
                  {b('ReadMore')} <MoveRight className='h-4 w-8 mt-0.5 -ml-1'/>
                </Link>
              </div>
            </div>
                  </div>
                ))}
              </div>

    {/* book demo card */}
    <div className="max-w-md mx-auto h-fit relative overflow-hidden">
      
      <div className="relative bg-red-400 rounded lg:rounded-xl shadow-xl p-8 text-center">  
        <div>
            <Sparkles className=" absolute right-3 top-3 w-10 h-10 text-yellow-200 rotate-12" />
        </div>

        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
          {b('Book')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300"> {b('FreeDemo')} </span>
        </h2>
        
        <div className="w-20 h-1 bg-gradient-to-r from-yellow-300 to-pink-300 mx-auto mb-6 rounded-full"></div>

        <p className="text-white/90 text-lg mb-8 leading-relaxed font-medium">
         {b('bookdemopara')}
        </p>

        <div className="flex justify-center space-x-6 mb-8 text-white/80">
          <div className="flex flex-col items-center">
            <Users className="w-6 h-6 mb-1 text-green-300" />
            <span className="text-xs font-medium">{b('ExpertGuide')} </span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 mb-1 text-blue-300" />
            <span className="text-xs font-medium">{b('Minutes') }</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-6 h-6 mb-1 text-purple-300" />
            <span className="text-xs font-medium">{b('FreeTrial')}</span>
          </div>
        </div>

        <div className="relative group">
          <Link
            href="/demo/all-products"
            className="relative inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-800 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="relative z-10">{b('BookDemo')} </span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
          </Link>
        </div>

        <div className="mt-6 text-white/70 text-sm font-medium">
          {b('customers')}
        </div>
      </div>
    </div>
    </div>
   </section>

      {/* Filter & All Blogs Section */}
      <div className="mx-auto p-6 xl:pt-12">
        <div className="flex flex-col gap-8">
          <div className="w-full xl:w-8/12">
            <div className="sticky top-4 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-5">{b('Category')}</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded text-sm font-medium transition-all duration-200 ease-in-out ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-xl'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-600 mb-3">{b('Noblogs')} </h3>
                <p className="text-gray-500 text-lg">{b('Try')} </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="group bg-white/70 backdrop-blur-lg rounded shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-white/20 hover:border-white/40 transform hover:-translate-y-2"
                    style={{
                      animationName: 'fadeIn',
                      animationDuration: '2s',
                      animationTimingFunction: 'ease-in-out',
                      animationDelay: '0.5s',
                    }}
                  >
                    <div className="relative overflow-hidden rounded h-64">
                      {blog.blogimage?.[0] && (
                        <>
                          <img
                            src={`${apiUrl}/uploads/${blog.blogimage[0]}`}
                            alt={t(blog.title)}
                            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      )}
                      {blog.products && (
                        <div className="absolute bottom-4 left-4">
                          <span
                            className={`text-xs font-bold px-4 py-2 rounded shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 ${
                              productColorMap[blog.products] || productColorMap.Default
                            }`}
                          >
                            {blog.products}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {t(blog.title)}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="font-medium text-gray-600">By {blog.author}</span>
                        <span className="mx-2">|</span>
                        <span>
                          {blog.publishedAt &&
                            new Date(blog.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${blog.blogpath}`}
                        className="inline-flex items-center border text-black px-6 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                      >
                        <span>{b('ReadMore')}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
