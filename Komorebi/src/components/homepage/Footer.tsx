import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaEnvelope } from 'react-icons/fa'; 

interface FooterLink {
  label: string;
  url: string;
}

interface FooterProps {
  komorebi: string;
  year: number;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}


const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div className="mb-8 md:mb-0 text-center md:text-left"> 
    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.url}
            className="text-gray-300 hover:text-white transition duration-300 text-base md:text-sm"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);


const Footer: React.FC<FooterProps> = ({ komorebi, year }) => {
  const aboutLinks: FooterLink[] = [
    { label: 'Who we are', url: '/about/who' },
    { label: 'Our History', url: '/about/history' },
  ];

  const shopLinks: FooterLink[] = [
    { label: 'Japanese Snacks', url: '/shop/japanese' },
    { label: 'Sweet Treats', url: '/shop/sweet' },
    { label: 'Healthy Bites', url: '/shop/healthy' },
    { label: 'International', url: '/shop/international' },
    { label: 'Best Sellers', url: '/shop/bestsellers' },
  ];

  const sellLinks: FooterLink[] = [
    { label: 'Star Selling', url: '/sell/start' },
    { label: 'Seller Dashboard', url: '/sell/dashboard' },
    { label: 'Seller Resources', url: '/sell/resources' },
    { label: 'Fees & Pricing', url: '/sell/pricing' },
    { label: 'Success Stories', url: '/sell/stories' },
  ];

  return (
    <footer className="bg-[var(--komorebi-pink)] text-[var(--komorebi-offwhite)] px-6 py-10 md:px-16 md:py-12">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 lg:gap-16">

        <div className="col-span-1 text-center md:text-left"> 
          <button className="text-[var(--komorebi-yellow)] text-3xl sm:text-2xl font-bold hover:text-[var(--komorebi-offwhite)] transition-colors mb-4">
            {komorebi}
          </button>
          
          <p className="text-base md:text-sm leading-relaxed mb-6"> 
            Sweetening your most important moments with a variety of national and international sweets.
          </p>

          <div className="mt-4">
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4 text-2xl md:text-xl justify-center md:justify-start"> 
              <a href="#" className="hover:text-[var(--komorebi-offwhite)] transition duration-300" aria-label="Instagram">
                <FaInstagram /> 
              </a>
              
              <a href="#" className="hover:text-[var(--komorebi-offwhite)] transition duration-300" aria-label="Facebook">
                <FaFacebookF /> 
              </a>
              
              <a href="#" className="hover:text-[var(--komorebi-offwhite)] transition duration-300" aria-label="Twitter">
                <FaTwitter /> 
              </a>
              
              <a href="#" className="hover:text-[var(--komorebi-offwhite)] transition duration-300" aria-label="Email">
                <FaEnvelope /> 
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-start"> 
            <FooterColumn title="About us" links={aboutLinks} />
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Sell" links={sellLinks} />
        </div>
      </div>

      <hr className="border-t border-[var(--komorebi-offwhite)] my-8 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center text-xs">
        
        <p className="order-2 md:order-1 mt-4 md:mt-0 text-sm md:text-xs text-center md:text-left">
          © {year} {komorebi}. All rights reserved.
        </p>
        
        <div className="flex space-x-6 order-1 md:order-2 justify-center md:justify-start text-sm md:text-xs"> 
          <a href="/privacy-policy" className="hover:text-white transition duration-300">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-white transition duration-300">Terms of Service</a>
          <a href="/help-center" className="hover:text-white transition duration-300">Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;