"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Book, ArrowRight, PlusCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-fade-in-up');
      });
    }, { threshold: 0.1 });
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }, 100);

    const userDataString = localStorage.getItem('user');
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
    }

    const token = localStorage.getItem('token');
    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` }});
            setBookings(data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            toast.error("Could not fetch bookings.");
        }
    };
    fetchBookings();
  }, [router]);
  
  const getStatusChip = (status) => {
      switch (status) {
          case 'Completed': return 'bg-green-100 text-green-800';
          case 'In Progress': return 'bg-blue-100 text-blue-800';
          case 'Pending': case 'Assigned': return 'bg-yellow-100 text-yellow-800';
          case 'Cancelled': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
            <h2 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}!</h2>
            <p className="text-slate-500 mt-1">Here&apos;s an overview of your services.</p>
        </div>
        
        <div className="bg-indigo-600 text-white p-8 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center fade-in" style={{ animationDelay: '0.2s' }}>
            <div>
                <h3 className="text-2xl font-bold mb-2">Ready for a Service?</h3>
                <p className="text-indigo-200">Keep your solar panels in peak condition.</p>
            </div>
            <button onClick={() => router.push('/customer/book-service')} className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg mt-4 md:mt-0 hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center shadow-md">
                Book a New Service <PlusCircle className="ml-2 h-5 w-5"/>
            </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">My Bookings</h3>
          <div className="space-y-4">
            {bookings.length > 0 ? bookings.map(booking => (
              <div key={booking._id} className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-grow">
                  <p className="font-bold text-slate-700 text-lg">{booking.serviceType}</p>
                  <p className="text-sm text-slate-500 mt-1">Date: {new Date(booking.bookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm text-slate-500">Technician: <span className="font-medium text-slate-600">{booking.technician?.name || 'Pending Assignment'}</span></p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusChip(booking.status)}`}>{booking.status}</span>
                    <button className="text-indigo-600 hover:text-indigo-800 hidden sm:block"><ArrowRight className="h-5 w-5"/></button>
                </div>
              </div>
            )) : 
            <div className="text-center py-10"><Book className="mx-auto h-12 w-12 text-slate-300" /><p className="mt-4 text-slate-500">You have no upcoming services.</p></div>
            }
          </div>
        </div>
    </div>
  );
}