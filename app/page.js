"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sun, ShieldCheck, Wrench, Zap, Award, Smile, Star, ChevronDown, Facebook, Twitter, Instagram, Menu, X, MessageSquare, Send } from 'lucide-react';

// FAQ Item Component
const FaqItem = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        className="w-full text-left text-lg font-semibold flex justify-between items-center cursor-pointer list-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown className={`h-5 w-5 text-indigo-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden"><p className="text-slate-600 mt-3 pt-2">{children}</p></div>
      </div>
    </div>
  );
};
const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useIsInView(ref);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const endValue = parseInt(end);
            if (start === endValue) return;

            let startTime = null;
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const increment = Math.min(Math.floor(progress / duration * endValue), endValue);
                setCount(increment);
                if (progress < duration) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}</span>;
};

// Helper hook to detect when an element is in view
const useIsInView = (ref) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);
    return isIntersecting;
};
// --- UPDATED CHATBOT COMPONENT ---
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! I can help you understand how to book a service. What would you like to know?' }
    ]);
    const [options, setOptions] = useState(['How to book a service?']);
    const [step, setStep] = useState(0); // State to manage conversation flow
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleOptionClick = (optionText) => {
        const userMessage = { from: 'user', text: optionText };
        let botResponse = {};
        let newOptions = [];
        let nextStep = step + 1;

        // Using a switch statement for cleaner, more reliable logic
        switch (step) {
            case 0: // Initial question
                botResponse = { from: 'bot', text: 'Great! First, you need to sign up or log in to your account.' };
                newOptions = ['What\'s the next step?'];
                break;
            case 1: // After login
                botResponse = { from: 'bot', text: 'After logging in, you will land on your dashboard. Click the "Book a New Service" button.' };
                newOptions = ['And after that?'];
                break;
            case 2: // After clicking book
                botResponse = { from: 'bot', text: 'Simply fill in the form with the service type, your address, and a preferred date and time.' };
                newOptions = ['How do I pay?'];
                break;
            case 3: // Payment
                botResponse = { from: 'bot', text: 'After submitting the form, you can choose a payment method like Easypaisa/Jazzcash or Cash on Delivery to confirm your booking. That\'s it!' };
                newOptions = ['Thanks! Start Over.'];
                break;
            case 4: // Restart
            default:
                botResponse = { from: 'bot', text: 'You\'re welcome! What would you like to know?' };
                newOptions = ['How to book a service?'];
                nextStep = 0; // Reset the flow
                break;
        }
        
        if (optionText === 'Thanks! Start Over.') {
            botResponse = { from: 'bot', text: 'You\'re welcome! What would you like to know?' };
            newOptions = ['How to book a service?'];
            nextStep = 0;
        }

        setMessages(prev => [...prev, userMessage, botResponse]);
        setOptions(newOptions);
        setStep(nextStep);
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed z-9999 bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-80 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <div className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                    <h3 className="font-bold text-lg">Solar Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`my-2 flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                            <span className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${msg.from === 'bot' ? 'bg-slate-100 text-slate-700 rounded-bl-none' : 'bg-indigo-500 text-white rounded-br-none'}`}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-2 border-t border-slate-200">
                    {options.map((opt, index) => (
                        <button key={index} onClick={() => handleOptionClick(opt)} className="w-full text-left p-2.5 mb-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors text-sm">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            {/* Chat Bubble Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            >
                {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
            </button>
        </>
    );
};


export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-fade-in-up');
      });
    }, { threshold: 0.1 });
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => observer.observe(el));
    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans">
      <header className="bg-white/80 shadow-sm sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Sun className="inline-block text-amber-500 mr-2 h-7 w-7" />
              Solar Revive
            </Link>
          </h1>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Services</Link>
            <Link href="#why-us" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Why Us</Link>
            <Link href="#faq" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">FAQ</Link>
            <Link href="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
            <Link href="/signup" className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                Sign Up
            </Link>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
                <nav className="flex flex-col items-center space-y-4 p-6">
                    <Link href="#services" onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Services</Link>
                    <Link href="#why-us" onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Why Us</Link>
                    <Link href="#faq" onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">FAQ</Link>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Login</Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="bg-indigo-600 text-white rounded-lg w-full text-center px-5 py-2.5 font-semibold hover:bg-indigo-700">
                        Sign Up
                    </Link>
                </nav>
            </div>
        )}
      </header>

      <main>
        <section className="relative bg-cover bg-center text-white py-48 px-6" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-slate-900 opacity-70"></div>
          <div className="relative container mx-auto text-center z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Revitalize Your Solar Investment
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-slate-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Expert cleaning, installation, and maintenance services designed to maximize your energy output and protect your investment for years to come.
            </p>
            <Link href="/login" className="bg-amber-500 text-slate-900 font-bold rounded-full py-4 px-10 text-lg hover:bg-amber-400 transition duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-amber-500/40 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              Book a Service Today
            </Link>
          </div>
        </section>

        <section id="services" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold text-slate-800 mb-4 fade-in">Our Comprehensive Solar Solutions</h3>
            <p className="text-slate-600 mb-16 max-w-2xl mx-auto fade-in" style={{ animationDelay: '0.2s' }}>
                From pristine cleaning to robust maintenance, we provide everything you need to keep your solar array performing at its peak.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{ animationDelay: '0.3s' }}>
                <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
                    <Sun className="h-10 w-10 text-indigo-600" />
                </div>
                <h4 className="text-2xl font-semibold mb-3">Solar Panel Cleaning</h4>
                <p className="text-slate-600">Our eco-friendly cleaning process removes dirt, dust, and grime, boosting your panel&apos;s efficiency by up to 30%.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{ animationDelay: '0.5s' }}>
                <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
                    <ShieldCheck className="h-10 w-10 text-indigo-600" />
                </div>
                <h4 className="text-2xl font-semibold mb-3">Solar Panel Installation</h4>
                <p className="text-slate-600">We provide seamless, expert installation of high-efficiency solar panels tailored specifically to your property and energy needs.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 fade-in group" style={{ animationDelay: '0.7s' }}>
                <div className="bg-indigo-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
                    <Wrench className="h-10 w-10 text-indigo-600" />
                </div>
                <h4 className="text-2xl font-semibold mb-3">Maintenance & Repair</h4>
                <p className="text-slate-600">Keep your system in optimal condition with our regular inspections, diagnostics, and prompt repair services.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="faq" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-slate-800 mb-4 fade-in">Frequently Asked Questions</h3>
              <p className="text-slate-600 max-w-2xl mx-auto fade-in" style={{ animationDelay: '0.2s' }}>Have questions? We&apos;ve got answers.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-2 fade-in" style={{ animationDelay: '0.4s' }}>
              <FaqItem question="How often should I have my solar panels cleaned?">
                For most residential systems, we recommend professional cleaning once or twice a year.
              </FaqItem>
              <FaqItem question="Is the cleaning process safe for my roof and panels?">
                Absolutely. We use specialized equipment and eco-friendly, non-abrasive cleaning solutions.
              </FaqItem>
            </div>
          </div>
        </section>


        <section id="impact" className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-4xl font-bold text-slate-800 mb-16 fade-in">Our Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center fade-in" style={{ animationDelay: '0.2s' }}>
                        <h4 className="text-6xl font-bold text-indigo-600">
                            <AnimatedCounter end={320} />+
                        </h4>
                        <p className="text-slate-500 mt-2 text-lg">Projects Completed</p>
                    </div>
                    <div className="text-center fade-in" style={{ animationDelay: '0.4s' }}>
                        <h4 className="text-6xl font-bold text-indigo-600">
                            <AnimatedCounter end={98} />
                        </h4>
                        <p className="text-slate-500 mt-2 text-lg">Technicians</p>
                    </div>
                    <div className="text-center fade-in" style={{ animationDelay: '0.6s' }}>
                        <h4 className="text-6xl font-bold text-indigo-600">
                            <AnimatedCounter end={45} />
                        </h4>
                        <p className="text-slate-500 mt-2 text-lg">Partners Nationwide</p>
                    </div>
                </div>
            </div>
        </section>
      </main>



      <footer className="bg-slate-800 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Sun className="inline-block text-amber-500 mr-2" />
                Solar Revive
              </h2>
              <p className="text-slate-400">Your trusted partner in harnessing the full power of the sun. Dedicated to quality, efficiency, and sustainability.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#services" className="text-slate-400 hover:text-white">Services</Link></li>
                <li><Link href="#why-us" className="text-slate-400 hover:text-white">Why Us</Link></li>
                <li><Link href="#faq" className="text-slate-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Johar Town Lahore</li>
                <li>SolarRevive@gmail.com</li>
                <li>+92 3111155500</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-slate-400 hover:text-white"><Facebook /></Link>
                <Link href="#" className="text-slate-400 hover:text-white"><Twitter /></Link>
                <Link href="#" className="text-slate-400 hover:text-white"><Instagram /></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 py-4">
            <div className="container mx-auto px-6 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} Solar Revive. All rights reserved.</p>
            </div>
        </div>
      </footer>
      
      <Chatbot />
    </div>
  );
}
