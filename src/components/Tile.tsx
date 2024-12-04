import React from "react";

interface TileProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode; // Optional icon prop
}

const Tile: React.FC<TileProps> = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center justify-between bg-white rounded-lg shadow-md p-4 h-40 w-40">
      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {icon && (
        <div className="mb-2 text-black">
          {React.cloneElement(icon as React.ReactElement, {
            className: "w-12 h-12",
          })}
        </div>
      )}
    </div>
  );
};

export default Tile;
