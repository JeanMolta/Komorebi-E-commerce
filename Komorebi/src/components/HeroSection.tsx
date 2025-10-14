import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="flex bg-[var(--komorebi-offwhite)] py-16 px-8">
      {/* Left side: Text */}
      <div className="w-1/2 bg-[var(--komorebi-green)] text-[var(--komorebi-offwhite)] flex flex-col justify-center px-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Komorebi!</h1>
        <p className="text-lg mb-6">
          From artisanal onigiri to international treats, find and sell the most delicious snacks in our curated marketplace. Connect with food lovers and discover your next favorite bite.
        </p>
        <button className="bg-[var(--komorebi-yellow)] text-[var(--komorebi-black)] px-6 py-3 rounded-full hover:bg-[var(--komorebi-gray)] transition-colors">
          Shop Now
        </button>
      </div>

      {/* Right side: Image */}
      <div className="w-1/2">
        <img
          src="/images/SnacHeroImg.jpg"
          alt="Snacks"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
