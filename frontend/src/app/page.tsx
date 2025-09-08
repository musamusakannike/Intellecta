import CurriculumPreview from '@/components/CurriculumPreview';
import CurriculumPreviewMobile from '@/components/CurriculumPreviewMobile';
import Features from '@/components/Features';
import Hero from '@/components/Hero'
import React from 'react'

const Home = () => {
  return (
    <div className='w-screen overflow-x-hidden'>
      <Hero />
      <Features />
      <CurriculumPreview />
      <CurriculumPreviewMobile />
    </div>
  )
}

export default Home;