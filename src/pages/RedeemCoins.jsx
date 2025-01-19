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
      const response = await axios.get("https://api.recruitmantra.com/user/getcoin", {
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
    <div className="text-center p-6">
      <h2 className="text-xl md:text-3xl text-left font-bold mb-4">Redeem</h2>
      <div className="text-right px-10 py-4">
        <span className=" text-xl font-bold p-2">
          🪙: {coins}
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start space-y-8">
        <div className="w-full md:w-1/2">
          <h3 className="text-xl font-bold mb-4">Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} coins={coins} />
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 mx-auto">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}

export default RedeemCoins;
