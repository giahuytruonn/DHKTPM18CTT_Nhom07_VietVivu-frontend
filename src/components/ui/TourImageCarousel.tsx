import React from "react";

interface Props {
  images: string[];
  onClick?: () => void;
}

const TourImageCarousel: React.FC<Props> = ({ images, onClick }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Gradient bên trái */}
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

      {/* Gradient bên phải */}
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <div className="overflow-x-auto flex gap-4 py-3 scrollbar-hide">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={onClick}
            className="min-w-[170px] h-36 rounded-xl overflow-hidden shadow transition-transform hover:scale-[1.03] cursor-pointer"
          >
            <img
              src={img}
              alt={`tour ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourImageCarousel;
