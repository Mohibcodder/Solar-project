// -------------------------------------------------------------------
// /app/api/bookings/route.js  <- CORRECTED
// -------------------------------------------------------------------
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '../../../utils/db';
import Booking from '../../../models/Booking';
import User from '../../../models/User';

// Ensure this route is always dynamically rendered
export const dynamic = 'force-dynamic';

// GET method ke liye function
export async function GET() {
  await connectDB();
  
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
    let bookings;
    if (user.role === 'admin') {
      bookings = await Booking.find({}).populate('customer').populate('technician');
    } else if (user.role === 'technician') {
      bookings = await Booking.find({ technician: user.userId }).populate('customer');
    } else { // customer
      bookings = await Booking.find({ customer: user.userId }).populate('technician');
    }
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// POST method ke liye function
export async function POST(request) {
  await connectDB();

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

  // --- FIX START ---
  // Admins should not be able to create bookings. Their role is to manage.
  if (user.role === 'admin') {
    return NextResponse.json(
      { success: false, message: 'Admin users cannot book services.' },
      { status: 403 } // 403 Forbidden
    );
  }
  // --- FIX END ---

  try {
    const body = await request.json();
    // Because we blocked the admin, user.userId will now always be a valid ObjectId
    const bookingData = { ...body, customer: user.userId };
    const booking = await Booking.create(bookingData);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    // The original BSONError will be caught here if something else goes wrong.
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
