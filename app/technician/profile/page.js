"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Briefcase, User } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianProfilePage() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` }});
                setUser(data.data);
                setFormData({ name: data.data.name, email: data.data.email, phone: data.data.profile.phone || '' });
            } catch (error) {
                toast.error("Could not fetch profile data.");
                router.push('/login');
            }
        };
        fetchUserData();
    }, [router]);

    const handleInfoChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const loadingToast = toast.loading("Updating profile...");
        try {
            await axios.put('/api/users/profile', formData, { headers: { Authorization: `Bearer ${token}` }});
            toast.success("Profile updated successfully!", { id: loadingToast });
        } catch (error) {
            toast.error("Update failed.", { id: loadingToast });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const loadingToast = toast.loading("Changing password...");
        try {
            await axios.put('/api/users/profile', passwordData, { headers: { Authorization: `Bearer ${token}` }});
            toast.success("Password changed successfully!", { id: loadingToast });
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.", { id: loadingToast });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Toaster />
            <aside className="w-64 bg-white shadow-md p-4">
                <h1 className="text-xl font-bold mb-8">Welcome, {user?.name}</h1>
                <nav className="space-y-2">
                    <Link href="/technician/dashboard" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><LayoutDashboard className="mr-3"/>Dashboard</Link>
                    <Link href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded-lg"><Briefcase className="mr-3"/>Jobs</Link>
                    <Link href="/technician/profile" className="flex items-center p-2 text-gray-700 bg-gray-200 rounded-lg"><User className="mr-3"/>Profile</Link>
                </nav>
                <button onClick={handleLogout} className="w-full mt-8 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Logout</button>
            </aside>

            <main className="flex-1 p-8">
                <h2 className="text-3xl font-bold mb-6">My Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Update Info Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Update Information</h3>
                        <form onSubmit={handleInfoUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInfoChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInfoChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInfoChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Save Changes</button>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Current Password</label>
                                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">New Password</label>
                                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Update Password</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
