"use client";
import Head from 'next/head';

export default function Home() {
  
  return (
    <>
      <Head>
        <title>Your SEO Optimized Title</title>
        <meta name="description" content="Your SEO description goes here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section id="home" className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Our Site</h1>
            <p className="py-6">This is the home section of your website.</p>
          </div>
        </div>
      </section>

      <section id="about" className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p>Information about your company or service goes here.</p>
        </div>
      </section>

      <section id="services" className="py-12 bg-base-200">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p>List of services or products you offer.</p>
        </div>
      </section>

      <section id="contact" className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p>Contact information or a form can go here.</p>
        </div>
      </section>
    </>
  );
}
