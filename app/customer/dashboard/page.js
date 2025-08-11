"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Book, History, Settings, Bot } from 'lucide-react';

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (!userData || userData.role !== 'customer') {
          router.push('/login');
          return;
        }
        setUser(userData);
    } else {
        router.push('/login');
        return;
    }

    const token = localStorage.getItem('token');
    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(data.data);
        } catch (error) {
            toast.error("Could not fetch bookings.");
            if(error.response?.status === 401){
                router.push('/login');
            }
        }
    };
    fetchBookings();
  }, [router]);
  
  // --- FIX START ---
  const handleLogout = () => {
    // Clear user data from browser storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    // Redirect to login page
    router.push('/login');
  };
  // --- FIX END ---

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster/>
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-8">Welcome, {user?.name}</h1>
        <nav className="space-y-2">
          <a href="#" className="flex items-center p-2 text-gray-700 bg-gray-200 rounded-lg"><LayoutDashboard className="mr-3"/>Dashboard</a>
          <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><Book className="mr-3"/>Bookings</a>
          <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><History className="mr-3"/>History</a>
          <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><Settings className="mr-3"/>Settings</a>
        </nav>
        <button onClick={handleLogout} className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Logout</button>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">My Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Book a New Service</h3>
                 <p className="text-gray-600 mb-4">Need help with your solar panels? Schedule a service now.</p>
                <button onClick={() => router.push('/customer/book-service')} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    Book Now
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center"><Bot className="mr-2 text-blue-500"/> AI Assistant</h3>
                 <p className="text-gray-600 mb-4">Confused? Let our AI guide you on how to book a service.</p>
                <button onClick={() => setShowAIAssistant(true)} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                    Get Help
                </button>
            </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
          <div className="space-y-4">
            {bookings.length > 0 ? bookings.map(booking => (
              <div key={booking._id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{booking.serviceType}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                   <p className="text-sm text-gray-500">Tracking ID: {booking.trackingId}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                    booking.status === 'Completed' ? 'bg-green-200 text-green-800' : 
                    booking.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                }`}>{booking.status}</span>
              </div>
            )) : <p>You have no upcoming services.</p>}
          </div>
        </div>

        {showAIAssistant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
                    <h3 className="text-2xl font-bold mb-4 flex items-center"><Bot className="mr-2"/> How to Book a Service</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Click the "Book Now" button on your dashboard.</li>
                        <li>Fill in the service details: choose a service type, enter your address, and select a convenient date and time.</li>
                        <li>Review your booking details and proceed to payment.</li>
                        <li>Once payment is successful, your booking is confirmed! You will receive a tracking ID.</li>
                        <li>You can view your booking status and details right here on your dashboard.</li>
                    </ol>
                    <button onClick={() => setShowAIAssistant(false)} className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                        Close
                    </button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}