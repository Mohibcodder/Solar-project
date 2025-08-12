"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ApprovePaymentsPage() {
    const [pendingPayments, setPendingPayments] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const bookingsRes = await axios.get('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
            // Sirf Easypaisa/Jazzcash aur Pending status wali payments filter karein
            setPendingPayments(
                bookingsRes.data.data.filter(b => 
                    b.payment.method === 'Easypaisa/Jazzcash' && b.payment.status === 'Pending'
                )
            );
        } catch (error) {
            toast.error("Could not fetch payment data.");
        }
    };

    const handleApprovePayment = async (bookingId) => {
        const token = localStorage.getItem('token');
        const loadingToast = toast.loading("Approving payment...");
        try {
            await axios.put(`/api/bookings/${bookingId}`, 
                { payment: { status: 'Paid' } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment approved!", { id: loadingToast });
            fetchData(); // Refresh data
        } catch (error) {
            toast.error("Approval failed.", { id: loadingToast });
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Approve Manual Payments</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-3">Customer</th>
                            <th className="p-3">Transaction ID (TID)</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPayments.map(booking => (
                            <tr key={booking._id} className="border-b">
                                <td className="p-3">{booking.customer?.name}</td>
                                <td className="p-3">{booking.payment.paymentId}</td>
                                <td className="p-3">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <button onClick={() => handleApprovePayment(booking._id)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}