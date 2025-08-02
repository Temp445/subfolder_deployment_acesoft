import Commonbar from '@/components/Commonbar';
import Footer from '@/components/Footer';
import Header from '@/components/Header'
import React from 'react'

const admin = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
        <Commonbar />
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default admin