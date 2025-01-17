import React from "react";

export const Card = React.memo(function (props) {
  const { data, dataIndex } = props;
  const { image } = data[dataIndex];
  return (
    <div className="my-slide-component w-full h-[500px]">
      <img
        className="object-cover"
        draggable={false}
        src={image}
        alt={`Slide ${dataIndex + 1}`}
      />
    </div>
  );
});
