import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import OrderForm from "../components/OrderForm";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiDollarSign } from "react-icons/fi";

function RedeemCoins() {
  const [coins, setCoins] = useState(0);

  // Products array with updated image links
  const products = [
    {
      id: 1,
      title: "RecruitMantra Cap",
      price: 500,
      image:
        "https://internview-assets.s3.ap-south-1.amazonaws.com/1-removebg-preview.png",
    },
    {
      id: 2,
      title: "RecruitMantra Shirt",
      price: 800,
      image:
        "https://internview-assets.s3.ap-south-1.amazonaws.com/3-removebg-preview.png",
    },
    {
      id: 3,
      title: "RecruitMantra Pouch",
      price: 1000,
      image:
        "https://internview-assets.s3.ap-south-1.amazonaws.com/2-removebg-preview.png",
    },
  ];

  // Fetch user coins
  const fetchUserCoins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/user/getcoin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCoins(response.data.coins);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserCoins();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text">
              Redeem Your Coins
            </h2>
            <p className="text-gray-600 mt-2">Exclusive Merchandise Collection</p>
          </div>

          {/* Coin Balance Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-4 md:mt-0 bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">🪙 {coins}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-gray-700 mb-6">
              <FiShoppingBag className="w-5 h-5" />
              <h3 className="text-xl font-semibold">Featured Products</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    {...product}
                    coins={coins}
                    className="hover:shadow-lg transition-shadow"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Order Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-gray-200 h-fit sticky top-8"
          >
            <div className="flex items-center gap-2 text-gray-700 mb-6">
              <FiArrowRight className="w-5 h-5" />
              <h3 className="text-xl font-semibold">Shipping Details</h3>
            </div>
            <OrderForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default RedeemCoins;