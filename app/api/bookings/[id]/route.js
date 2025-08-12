// -------------------------------------------------------------------
// /app/api/bookings/[id]/route.js <- CORRECTED
// -------------------------------------------------------------------
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../utils/db';
import Booking from '../../../../models/Booking';

// This line ensures the route is always rendered dynamically
export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;

  const authorization = headers().get('authorization');
  let user = null;
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1];
    try { 
      user = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (error) { 
      user = null; 
    }
  }

  if (!user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    const isOwner = user.role !== 'admin' && booking.customer.toString() === user.userId;
    const isAssignedTechnician = booking.technician && booking.technician.toString() === user.userId;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAssignedTechnician && !isAdmin) {
        return NextResponse.json({ success: false, message: 'Not authorized to update this booking' }, { status: 403 });
    }

    // --- FIX START: Logic updated to preserve Transaction ID ---
    // Agar admin payment approve kar raha hai, to sirf status update karein
    if (isAdmin && body.payment?.status === 'Paid') {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id, 
            { $set: { 'payment.status': 'Paid' } }, // $set sirf di gayi field ko update karta hai
            { new: true, runValidators: true }
        );
        return NextResponse.json({ success: true, data: updatedBooking });
    }
    // --- FIX END ---

    // Baaki updates (jaise technician assign karna) ke liye
    if (isAdmin && body.technician) {
        body.status = 'Assigned';
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
