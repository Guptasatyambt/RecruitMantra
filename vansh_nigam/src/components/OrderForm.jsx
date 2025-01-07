import React from "react";

const OrderForm = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <form className="bg-white p-6 rounded-lg shadow-md space-y-4 text-left">
        <h2 className="text-2xl font-bold mb-4">Order</h2>

        <div>
          <label className="block text-gray-700">Item</label>
          <select className="w-full p-2 border rounded-md mt-1">
            <option>Choose Items</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-gray-700">Contact</label>
          <input
            type="text"
            placeholder="Contact With Country Code"
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700">Address</label>
          <textarea
            placeholder="Address"
            className="w-full p-2 border rounded-md mt-1"
          ></textarea>
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-gray-700">Pincode</label>
          <input
            type="text"
            placeholder="Pincode"
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-brown-600 text-white py-2 rounded-md hover:bg-brown-700"
        >
          Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
