"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Book, Star, PlusCircle, Calculator } from 'lucide-react';

// Rating Modal Component
const RatingModal = ({ booking, onClose, onRatingSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        onRatingSubmit(booking._id, rating);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
                <h3 className="text-2xl font-bold mb-2 text-slate-800">Rate Your Service</h3>
                <p className="text-slate-500 mb-6">How was your experience with the technician?</p>
                <div className="flex justify-center items-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-10 w-10 cursor-pointer transition-colors ${ (hoverRating || rating) >= star ? 'text-amber-400' : 'text-slate-300'}`}
                            fill="currentColor"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={onClose} className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg hover:bg-slate-200 font-semibold">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-semibold">
                        Submit Rating
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
  const router = useRouter();

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    try {
        const { data } = await axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` }});
        setBookings(data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
        toast.error("Could not fetch bookings.");
    }
  };

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
    } else {
        router.push('/login');
    }
    fetchBookings();
  }, [router]);

  const handleRatingSubmit = async (bookingId, rating) => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading("Submitting rating...");
    try {
        await axios.put(`/api/bookings/${bookingId}`, { rating }, { headers: { Authorization: `Bearer ${token}` }});
        toast.success("Thank you for your feedback!", { id: loadingToast });
        setSelectedBookingForRating(null);
        fetchBookings(); // Refresh bookings to show the new rating
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit rating.", { id: loadingToast });
    }
  };
  
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
        <Toaster position="top-right" />
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}!</h2>
            <p className="text-slate-500 mt-1">Here&apos;s an overview of your services.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-indigo-600 text-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Ready for a Service?</h3>
                    <p className="text-indigo-200">Keep your solar panels in peak condition.</p>
                </div>
                <button onClick={() => router.push('/customer/book-service')} className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg mt-4 hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center shadow-md self-start">
                    Book a New Service <PlusCircle className="ml-2 h-5 w-5"/>
                </button>
            </div>
            <div className="bg-amber-500 text-slate-900 p-8 rounded-xl shadow-lg flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Plan Your System</h3>
                    <p className="text-amber-900">Estimate the solar system size you need.</p>
                </div>
                <button onClick={() => router.push('/customer/calculator')} className="bg-white text-amber-900 font-bold py-3 px-6 rounded-lg mt-4 hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center shadow-md self-start">
                    Open Estimator <Calculator className="ml-2 h-5 w-5"/>
                </button>
            </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
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
                    
                    {/* Rating Display/Button */}
                    {booking.status === 'Completed' && (
                        booking.rating ? (
                            <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(booking.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor"/>)}
                                {[...Array(5 - booking.rating)].map((_, i) => <Star key={i} size={18} className="text-slate-300"/>)}
                            </div>
                        ) : (
                            <button onClick={() => setSelectedBookingForRating(booking)} className="bg-amber-400 text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-amber-500 transition-colors">
                                Rate Service
                            </button>
                        )
                    )}
                </div>
              </div>
            )) : 
            <div className="text-center py-10">
                <Book className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4 text-slate-500">You have no upcoming services.</p>
            </div>
            }
          </div>
        </div>
        {selectedBookingForRating && <RatingModal booking={selectedBookingForRating} onClose={() => setSelectedBookingForRating(null)} onRatingSubmit={handleRatingSubmit} />}
    </div>
  );
}
