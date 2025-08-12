"use client";

import { Sun, ShieldCheck, Wrench, Zap, Award, Smile, Star, ChevronDown, Facebook, Twitter, Instagram } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Sun className="inline-block text-yellow-500 mr-2 h-7 w-7" />
              Solar Revive
            </a>
          </h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-gray-600 hover:text-blue-500">Services</a>
            <a href="#why-us" className="text-gray-600 hover:text-blue-500">Why Us</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-500">FAQ</a>
            <a href="/login" className="text-gray-600 hover:text-blue-500 px-4">Login</a>
            <a href="/signup" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-colors">Sign Up</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-cover bg-center text-white py-40 px-6" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative container mx-auto text-center z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Revitalize Your Solar Investment</h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">Expert cleaning, installation, and maintenance services designed to maximize your energy output and protect your investment for years to come.</p>
            <a href="#contact" className="bg-blue-500 text-white font-bold rounded-full py-4 px-10 text-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 inline-block">
              Book a Service Today
            </a>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold text-gray-800 mb-2">Our Comprehensive Solar Solutions</h3>
            <p className="text-gray-600 mb-16 max-w-2xl mx-auto">From pristine cleaning to robust maintenance, we provide everything you need to keep your solar array performing at its peak.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Sun className="h-16 w-16 text-blue-500 mx-auto mb-5" />
                <h4 className="text-xl font-semibold mb-3">Solar Panel Cleaning</h4>
                <p className="text-gray-600">Our eco-friendly cleaning process removes dirt, dust, and grime, boosting your panel&apos;s efficiency by up to 30%.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <ShieldCheck className="h-16 w-16 text-blue-500 mx-auto mb-5" />
                <h4 className="text-xl font-semibold mb-3">Solar Panel Installation</h4>
                <p className="text-gray-600">We provide seamless, expert installation of high-efficiency solar panels tailored specifically to your property and energy needs.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Wrench className="h-16 w-16 text-blue-500 mx-auto mb-5" />
                <h4 className="text-xl font-semibold mb-3">Maintenance & Repair</h4>
                <p className="text-gray-600">Keep your system in optimal condition with our regular inspections, diagnostics, and prompt repair services.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section id="why-us" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-800 mb-2">Why Solar Revive?</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">We are more than just a service provider; we are your partners in clean energy.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Certified Experts</h4>
                <p className="text-gray-600">Our technicians are fully trained, certified, and insured to handle your solar systems with utmost professionalism.</p>
              </div>
              <div className="p-6">
                <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Maximum Efficiency</h4>
                <p className="text-gray-600">We use the latest technology and techniques to ensure your panels operate at their highest possible efficiency.</p>
              </div>
              <div className="p-6">
                <Smile className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Customer Satisfaction</h4>
                <p className="text-gray-600">Your satisfaction is our priority. We guarantee a job well done and provide transparent communication throughout.</p>
              </div>
              <div className="p-6">
                <ShieldCheck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Safety First</h4>
                <p className="text-gray-600">We adhere to strict safety protocols to protect your property and our team during every service visit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-800 mb-2">What Our Customers Say</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">We&apos;re proud to have earned the trust of homeowners and businesses across the region.</p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <div className="flex text-yellow-500 mb-4">
                  <Star /><Star /><Star /><Star /><Star />
                </div>
                <p className="text-gray-600 mb-6 italic">{"After Solar Revive cleaned our panels, we saw an immediate 25% increase in our energy production. Incredible service and very professional team!"}</p>
                <p className="font-bold text-gray-800">- Aisha K., Paris</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <div className="flex text-yellow-500 mb-4">
                  <Star /><Star /><Star /><Star /><Star />
                </div>
                <p className="text-gray-600 mb-6 italic">{"The installation process was smooth and hassle-free. The team explained everything clearly and were very respectful of our property. Highly recommended."}</p>
                <p className="font-bold text-gray-800">- Marc D., Lyon</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <div className="flex text-yellow-500 mb-4">
                  <Star /><Star /><Star /><Star /><Star />
                </div>
                <p className="text-gray-600 mb-6 italic">{"We signed up for the annual maintenance plan. It gives us great peace of mind knowing our investment is being looked after by experts."}</p>
                <p className="font-bold text-gray-800">- Sophie L., Marseille</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">Have questions? We&apos;ve got answers. Here are some of the most common inquiries we receive.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              <details className="border-b border-gray-200 py-4 group">
                <summary className="text-lg font-semibold flex justify-between items-center cursor-pointer list-none">
                  How often should I have my solar panels cleaned?
                  <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-gray-600 mt-2">For most residential systems, we recommend professional cleaning once or twice a year. However, this can vary based on your location&apos;s dust, pollen, and pollution levels. We can provide a personalized recommendation during a consultation.</p>
              </details>
              <details className="border-b border-gray-200 py-4 group">
                <summary className="text-lg font-semibold flex justify-between items-center cursor-pointer list-none">
                  Is the cleaning process safe for my roof and panels?
                  <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-gray-600 mt-2">Absolutely. We use specialized equipment and eco-friendly, non-abrasive cleaning solutions designed specifically for solar panels. Our methods are tough on dirt but gentle on your panels and roofing materials.</p>
              </details>
              <details className="border-b border-gray-200 py-4 group">
                <summary className="text-lg font-semibold flex justify-between items-center cursor-pointer list-none">
                  What areas do you service?
                  <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-gray-600 mt-2">Solar Revive currently serves the entire Île-de-France region, with plans to expand to other major metropolitan areas soon. Contact us to confirm if we service your specific postal code.</p>
              </details>
            </div>
          </div>
        </section>

      

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Sun className="inline-block text-yellow-500 mr-2" />
                Solar Revive
              </h2>
              <p className="text-gray-400">Your trusted partner in harnessing the full power of the sun. Dedicated to quality, efficiency, and sustainability.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-400 hover:text-white">Services</a></li>
                <li><a href="#why-us" className="text-gray-400 hover:text-white">Why Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Solar Avenue,</li>
                <li>75001 Paris, France</li>
                <li>contact@solarrevive.fr</li>
                <li>+33 1 23 45 67 89</li>
              </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                    <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                    <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 py-4">
            <div className="container mx-auto px-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Solar Revive. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
