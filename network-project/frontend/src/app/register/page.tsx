"use client";

import { Input } from "../../components/input";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Registration</h1>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />

            <Input
              id="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
            />

            <Input
              id="phone"
              label="Phone"
              placeholder="Enter your phone number"
              type="tel"
            />

            <Input
              id="address"
              label="Address"
              placeholder="Enter your address"
              type="text"
            />

            <Input
              id="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              type="password"
            />
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
