"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Book, Users, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(userData);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const bookingsRes = await axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
      setBookings(bookingsRes.data.data);
      const techsRes = await axios.get('/api/users/technicians', { headers: { Authorization: `Bearer ${token}` } });
      setTechnicians(techsRes.data.data);
    } catch (error) {
      toast.error("Could not fetch dashboard data.");
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnician) {
        toast.error("Please select a technician.");
        return;
    }
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading("Assigning technician...");
    try {
        await axios.put(`/api/bookings/${selectedBooking._id}`, 
            { technician: selectedTechnician },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Technician assigned successfully!", { id: loadingToast });
        setSelectedBooking(null);
        setSelectedTechnician('');
        fetchData(); // Refresh data
    } catch (error) {
        toast.error("Assignment failed.", { id: loadingToast });
    }
  };
  
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        <Toaster />
        <aside className="w-64 bg-white shadow-md p-4">
          <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            <a href="#" className="flex items-center p-2 text-gray-700 bg-gray-200 rounded-lg"><LayoutDashboard className="mr-3"/>Dashboard</a>
            <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><Book className="mr-3"/>Bookings</a>
          </nav>
          <button onClick={handleLogout} className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Logout</button>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6">Manage Bookings</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Technician</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id} className="border-b">
                      <td className="p-3">{booking.customer?.name || 'N/A'}</td>
                      <td className="p-3">{booking.serviceType}</td>
                      <td className="p-3">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="p-3">{booking.status}</td>
                      <td className="p-3">{booking.technician?.name || 'Not Assigned'}</td>
                      <td className="p-3">
                        {booking.status === 'Pending' && (
                          <button onClick={() => setSelectedBooking(booking)} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Assign Technician Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Assign Technician</h3>
            <p className="mb-4">For: <span className="font-semibold">{selectedBooking.customer?.name}</span>&apos;s booking</p>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select Technician</label>
              <select 
                value={selectedTechnician} 
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Choose a technician</option>
                {technicians.map(tech => (
                  <option key={tech._id} value={tech._id}>{tech.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setSelectedBooking(null)} className="text-gray-600">Cancel</button>
              <button onClick={handleAssignTechnician} className="bg-blue-500 text-white px-6 py-2 rounded-lg">Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}