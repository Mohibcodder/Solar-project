import { NextResponse } from 'next/server';
import connectDB from '../../../../utils/db';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  await connectDB();
  try {
    // hasSubscription has been removed
    const { name, email, phone, password, role, expertise } = await request.json();

    if (!name || !email || !password || !role || !phone) {
      return NextResponse.json({ message: 'Please fill all fields' }, { status: 400 });
    }
    if (role === 'technician' && !expertise) {
        return NextResponse.json({ message: 'Technician must have an expertise' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      // hasSubscription is removed, will default to false in the model
      profile: {
          phone: phone,
          expertise: role === 'technician' ? expertise : 'Not Applicable'
      }
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}