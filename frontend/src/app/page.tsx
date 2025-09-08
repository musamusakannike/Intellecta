import CurriculumPreview from '@/components/CurriculumPreview';
import CurriculumPreviewMobile from '@/components/CurriculumPreviewMobile';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import React from 'react'

const Home = () => {
  return (
    <div className='w-screen overflow-x-hidden'>
      <Navigation />
      <section id="home">
        <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="courses">
        <CurriculumPreview />
        <CurriculumPreviewMobile />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="newsletter">
        <Newsletter />
      </section>
      <Footer />
    </div>
  )
}

export default Home;
