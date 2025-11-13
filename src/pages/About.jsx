// src/pages/About.jsx
import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Skeleton from '../components/ui/Skeleton';
import SkeletonText from '../components/ui/SkeletonText';

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate content/image load; replace with real fetch if needed
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="text-white p-6">
        <div className="text-2xl mb-6">
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="my-6 flex flex-col md:flex-row gap-12">
          <Skeleton className="w-full md:max-w-[360px] h-64 rounded-lg" />
          <div className="md:w-2/4 space-y-6">
            <SkeletonText lines={2} widths={['95%', '80%']} />
            <Skeleton className="h-5 w-28" />
            <SkeletonText lines={3} widths={['100%', '90%', '85%']} />
          </div>
        </div>

        <div className="text-xl my-4">
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="flex flex-col md:flex-row mb-20 gap-4">
          <div className="flex-1 border border-gray-700/50 p-6 rounded-lg">
            <SkeletonText lines={2} widths={['50%', '90%']} />
          </div>
          <div className="flex-1 border border-gray-700/50 p-6 rounded-lg">
            <SkeletonText lines={2} widths={['55%', '88%']} />
          </div>
          <div className="flex-1 border border-gray-700/50 p-6 rounded-lg">
            <SkeletonText lines={2} widths={['60%', '92%']} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="text-center text-2xl pt-10">
        <p>ABOUT <span className="font-semibold">US</span></p>
      </div>

      {/* About Section */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px] rounded-lg"
          src={assets.aboutpage2}
          alt="About Navyanta"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm">
          <p>
            Welcome to <b>Navyanta (Aluframe)</b>, your trusted partner in premium aluminium fabrication services.
            We specialize in delivering high-quality, certified solutions that combine durability, aesthetics, and precision engineering.
          </p>
          <p>
            At Navyanta, we’re committed to redefining the fabrication experience. From seamless workflows to transparent processes,
            our platform ensures that clients, architects, and contractors can collaborate with confidence and efficiency.
          </p>
          <b className="text-lg">Our Vision</b>
          <p>
            Our vision is to establish Navyanta as the go-to platform for aluminium fabrication —
            where innovation meets craftsmanship. We aim to set new benchmarks in trust, scalability, and design excellence,
            making fabrication services more accessible and professional than ever before.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-xl my-4">
        <p>WHY <span className="font-semibold">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col md:flex-row mb-20 gap-4">
        <div className="border border-gray-600 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer rounded-lg">
          <b>PRECISION:</b>
          <p>Engineered designs and fabrication workflows that guarantee accuracy and reliability.</p>
        </div>
        <div className="border border-gray-600 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer rounded-lg">
          <b>TRUST:</b>
          <p>Certified services and transparent processes that build long-term confidence with clients.</p>
        </div>
        <div className="border border-gray-600 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer rounded-lg">
          <b>INNOVATION:</b>
          <p>Modern design systems, scalable workflows, and premium aesthetics tailored to your project needs.</p>
        </div>
      </div>
    </div>
  );
};

export default About;