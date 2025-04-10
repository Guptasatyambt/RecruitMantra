import React from "react";
import { FiShoppingCart, FiMail, FiPhone, FiMapPin, FiHash } from "react-icons/fi";

const OrderForm = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <form className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6 border border-gray-100">
        {/* Form Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <FiShoppingCart className="w-6 h-6 text-amber-600" />
            Order Details
          </h2>
          <p className="text-gray-500 text-sm">Please fill in your shipping information</p>
        </div>

        {/* Item Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Item</label>
          <div className="relative">
            <select className="w-full pl-10 pr-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all">
              <option>Choose Option</option>
              <option>Cap</option>
              <option>T-shirt</option>
              <option>Pouch</option>
            </select>
            <FiShoppingCart className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <FiMail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+91 12345 67890"
                className="w-full pl-10 pr-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <FiPhone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
          <div className="relative">
            <textarea
              rows="3"
              placeholder="Full street address with landmark"
              className="w-full pl-10 pr-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            ></textarea>
            <FiMapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter 6-digit pincode"
              className="w-full pl-10 pr-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
            />
            <FiHash className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform transition-all hover:scale-[1.02] active:scale-95"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;