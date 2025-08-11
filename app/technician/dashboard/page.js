"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Briefcase, User, MapPin, Camera } from 'lucide-react';

export default function TechnicianDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if(userDataString){
        const userData = JSON.parse(userDataString);
        if (!userData || userData.role !== 'technician') {
          router.push('/login');
          return;
        }
        setUser(userData);
    } else {
        router.push('/login');
        return;
    }

    const token = localStorage.getItem('token');
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get('/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(data.data);
        } catch (error) {
            toast.error("Could not fetch assigned jobs.");
        }
    };
    fetchJobs();
  }, [router]);

  const handleUpdateStatus = async (jobId, status) => {
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Updating status...');
    try {
        await axios.put(`/api/bookings/${jobId}`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(jobs.map(j => j._id === jobId ? {...j, status} : j));
        if (selectedJob?._id === jobId) {
            setSelectedJob({...selectedJob, status});
        }
        toast.success('Status updated!', { id: loadingToast });
    } catch (error) {
        toast.error('Update failed.', { id: loadingToast });
    }
  };
  
  const handleImageUpload = (jobId, type) => {
      toast('This feature is for demonstration. Image upload would be implemented here.');
  }

  // --- FIX START ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    router.push('/login');
  };
  // --- FIX END ---

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster/>
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-8">Technician Panel</h1>
        <p className="mb-8">Welcome, {user?.name}</p>
        <nav className="space-y-2">
          <a href="#" className="flex items-center p-2 text-gray-700 bg-gray-200 rounded-lg"><LayoutDashboard className="mr-3"/>Dashboard</a>
          <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><Briefcase className="mr-3"/>Jobs</a>
          <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><User className="mr-3"/>Profile</a>
        </nav>
        <button onClick={handleLogout} className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Logout</button>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">My Assigned Jobs</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {jobs.length > 0 ? jobs.map(job => (
              <div key={job._id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold">{job.serviceType}</p>
                        <p className="text-sm text-gray-600">Customer: {job.customer.name}</p>
                        <p className="text-sm text-gray-500">Date: {new Date(job.bookingDate).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                        job.status === 'Completed' ? 'bg-green-200 text-green-800' : 
                        job.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
                        'bg-yellow-200 text-yellow-800'
                    }`}>{job.status}</span>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-4">
                    <button onClick={() => setSelectedJob(job)} className="flex items-center text-blue-600 hover:underline text-sm"><MapPin className="mr-1 h-4 w-4"/>View Details</button>
                </div>
              </div>
            )) : <p>No jobs assigned yet.</p>}
          </div>
        </div>
      </main>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full">
                <h3 className="text-2xl font-bold mb-4">Job Details ({selectedJob.status})</h3>
                <div className="mb-4">
                    <p><strong>Customer:</strong> {selectedJob.customer.name}</p>
                    <p><strong>Email:</strong> {selectedJob.customer.email}</p>
                    <p><strong>Address:</strong> {selectedJob.address}</p>
                    <p><strong>Service:</strong> {selectedJob.serviceType}</p>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-16 w-16 text-gray-400"/>
                    <p className="ml-4 text-gray-500">Google Map for customer location would be here.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button onClick={() => handleImageUpload(selectedJob._id, 'before')} className="w-full flex items-center justify-center bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"><Camera className="mr-2"/>Upload 'Before' Picture</button>
                    <button onClick={() => handleImageUpload(selectedJob._id, 'after')} className="w-full flex items-center justify-center bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"><Camera className="mr-2"/>Upload 'After' Picture</button>
                </div>
                 <div className="flex items-center gap-4">
                    {selectedJob.status === 'Confirmed' && <button onClick={() => handleUpdateStatus(selectedJob._id, 'In Progress')} className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Start Job</button>}
                    {selectedJob.status === 'In Progress' && <button onClick={() => handleUpdateStatus(selectedJob._id, 'Completed')} className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Mark as Completed</button>}
                </div>
                <button onClick={() => setSelectedJob(null)} className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                    Close
                </button>
            </div>
        </div>
      )}
    </div>
  );
}