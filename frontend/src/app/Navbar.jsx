import React from 'react';

const Navbar = ({ isLoggedIn, userName }) => {
  return (
    <div className="bg-gray-800 text-white p-4 flex items-center justify-between h-24">
      <div className="flex-1">
        <span className="ml-8 font-semibold text-xl">AppName</span>
      </div>
      <div className="flex flex-1 justify-center">
        <a href="/" className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out">Home</a>
        <a href="/about" className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out">About</a>
        <a href="/services" className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out">Services</a>
        <a href="/contact" className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out">Contact</a>
      </div>
      <div className="flex-1 text-right">
        {isLoggedIn ? (
          <span className="mr-8 font-semibold hover:underline transition duration-250 ease-in-out">{userName}</span>
        ) : (
          <div className="mr-8">
            <a href="/login" className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out">Login</a>
            <text>/</text>
            <a href="/signup" className="mx-2 font-semibold hover:underline transition duration-250 ease-in-out">Sign Up</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
