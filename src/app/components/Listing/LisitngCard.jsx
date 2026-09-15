import React from "react";
import Image from "next/image";

const ListingCard = ({
  image,
  icons,
  title,
  description,
  price,
  salary,
  toggle,
  onIconClick,
}) => {
  return (
    <div
      className="relative flex w-full min-h-[380px] flex-col overflow-hidden rounded-[24px] border bg-white p-3 shadow-card"
      style={{ borderColor: "var(--brand-gold-soft, #d8b039)" }}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-xl sm:h-64">
        <img
          src={image}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/b6.png";
          }}
          alt=""
        />
      </div>

      <div className="absolute right-5 top-6 flex space-x-2">
        {icons.map((icon, index) => (
          <Image
            key={index}
            src={icon}
            alt=""
            width={24}
            height={24}
            className="w-8 cursor-pointer rounded-full border border-[#F0E2B3] bg-white/90 p-1 shadow-sm"
            onClick={() => onIconClick(icon)}
          />
        ))}
      </div>

      <div className="flex flex-grow flex-col pt-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-[16px] font-medium text-[#78828A]">
            {title}
          </h2>
          {toggle && <div>{toggle}</div>}
        </div>

        {price && (
          <p className="mt-2 text-[18px] font-bold text-[#CD9403]">{price}</p>
        )}
        {salary && (
          <p className="mt-2 text-[18px] font-bold text-[#CD9403]">
            {salary}/mo
          </p>
        )}

        <p className="mt-2 line-clamp-3 text-[12px] font-medium text-[#78828A]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
