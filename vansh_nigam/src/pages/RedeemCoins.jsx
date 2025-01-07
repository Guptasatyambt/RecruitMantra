import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import OrderForm from "../components/OrderForm";
import axios from "axios";

function RedeemCoins() {
  const [coins, setCoins] = useState(0);
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

  const fetchUserCoins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://15.206.133.74/user/getcoin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      setCoins(response.data.coin);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserCoins();
  }, []);
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Redeem RecruitMantra Coins</h2>
      <div className="text-right p-10">
        <span className="text-orange-500 text-lg font-medium border-2 border-black p-2">
          🪙 Your Coins: {coins}
        </span>
      </div>
      <div className="justify-center items-center">
        <div className="w-full">
          <h3 className="text-xl font-bold mb-4">Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} coins={coins} />
            ))}
          </div>
        </div>

        <div className="w-full mx-auto">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}

export default RedeemCoins;
