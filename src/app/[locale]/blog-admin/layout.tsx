import Commonbar from '@/components/Commonbar';
import Footer from '@/components/Footer';
import Header from '@/components/Header'
import BlogProtectedRoute from '@/components/ProtectedRouteBlog'
import React from 'react'

const BlogAdmin = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <BlogProtectedRoute>
        <Commonbar />
        <Header />
        {children}
        <Footer />
      </BlogProtectedRoute>
    </div>
  )
}

export default BlogAdmin