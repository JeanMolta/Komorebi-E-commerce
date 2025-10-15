import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center text-[var(--komorebi-offwhite)]"
      style={{ backgroundImage: "url('/images/HeroSectionImg.jpg')" }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
        <h1 className="text-[var(--komorebi-black)] text-6xl font-bold mb-8">Welcome to Komorebi!</h1>
        <p className="text-lg mb-10 text-[var(--komorebi-black)] max-w-2xl">
          From artisanal onigiri to international treats, find and sell the most delicious snacks in our curated marketplace. Connect with food lovers and discover your next favorite bite.
        </p>
        <button className="bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] px-6 py-3 rounded-full hover:bg-[var(--komorebi-gray)] transition-colors font-bold">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
