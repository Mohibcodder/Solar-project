import Link from 'next/link';
import { Sun, ShieldCheck, Wrench } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <Sun className="inline-block text-yellow-500 mr-2" />
            Solar Revive
          </h1>
          <nav>
            <Link href="/login" className="text-gray-600 hover:text-blue-500 px-4">Login</Link>
            <Link href="/signup" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative bg-cover bg-center text-white py-32 px-6" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative container mx-auto text-center">
            <h2 className="text-5xl font-extrabold mb-4">Revitalize Your Solar Investment</h2>
            <p className="text-xl mb-8">Expert cleaning, installation, and maintenance services to maximize your energy output.</p>
            <Link href="/signup" className="bg-blue-500 text-white font-bold rounded-full py-4 px-8 hover:bg-blue-600 transition duration-300">
              Book a Service
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-12">Our Comprehensive Solar Solutions</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <Sun className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Solar Panel Cleaning</h4>
                <p className="text-gray-600">Boost efficiency by up to 30% with our professional cleaning service.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <ShieldCheck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Solar Panel Installation</h4>
                <p className="text-gray-600">Expert installation of high-efficiency solar panels tailored to your needs.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <Wrench className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Solar Panel Maintenance</h4>
                <p className="text-gray-600">Regular inspections and repairs to keep your system running smoothly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Solar Revive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}