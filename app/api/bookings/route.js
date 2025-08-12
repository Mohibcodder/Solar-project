import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '../../../utils/db';
import Booking from '../../../models/Booking';
import User from '../../../models/User';

// FIX: Yeh line Next.js ko batati hai ke is route ko hamesha dynamically handle karein
export const dynamic = 'force-dynamic';

// GET method
export async function GET() {
  await connectDB();
  
 const reqHeaders = await headers();
  const authorization = reqHeaders.get('authorization');
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
    } else {
      bookings = await Booking.find({ customer: user.userId }).populate('technician');
    }
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// POST method
export async function POST(request) {
  await connectDB();

  const reqHeaders = await headers();
  const authorization = reqHeaders.get('authorization');
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

  if (user.role === 'admin') {
    return NextResponse.json({ success: false, message: 'Admin users cannot book services.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const bookingData = { ...body, customer: user.userId };
    const booking = await Booking.create(bookingData);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}