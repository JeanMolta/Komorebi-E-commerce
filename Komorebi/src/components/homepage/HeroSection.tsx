import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full">
      {/* Responsive background image using picture element for different screen sizes */}
      <picture>
        {/* Large desktop image (1280px+) */}
        <source
          srcSet="/images/HeroSectionImgNormal.jpg"
          media="(min-width:1280px)"
        />
        {/* Tablet/medium desktop image (740px+) */}
        <source
          srcSet="/images/HeroSectionImg.jpg"
          media="(min-width:740px)"
        />
        {/* Mobile fallback image */}
        <img
          src="/images/HeroSectionImgMobile.jpg"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      </picture>

      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-[rgba(255,245,225,0.18)]" />

      {/* Hero content centered vertically and horizontally */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12">
        {/* Main heading with responsive font sizes */}
        <h1 className="text-[var(--komorebi-black)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8">
          Welcome to Komorebi!
        </h1>

        {/* Subtitle description with responsive sizing */}
        <p className="text-[var(--komorebi-black)] text-base sm:text-lg md:text-xl max-w-2xl mb-6 sm:mb-10 px-2">
          From artisanal onigiri to international treats, find and sell the most delicious snacks in our curated marketplace. Connect with food lovers and discover your next favorite bite.
        </p>

        {/* Call-to-action button */}
        <button className="btn-komorebi-yellow border border-white/20 shadow-sm px-6 py-3 rounded-full font-bold">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;