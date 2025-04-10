import React from 'react';

const ProductCard = ({ image, title, price, coins }) => {
  return (
    <div className="bg-white w-2/3 md:w-auto rounded-lg shadow-md p-4 text-center">
      <img src={image} alt={title} className="w-auto h-20 md:h-40 mx-auto object-cover rounded-md" />
      <h3 className="text-base md:text-lg font-semibold mt-2">{title}</h3>
      <p className="text-orange-500 text-sm md:text-base font-medium">🪙 {price}</p>
      {coins < price ? <p className="text-sm text-red-500">you don't have enough coins</p> : ""}
    </div>
  );
};

export default ProductCard;
