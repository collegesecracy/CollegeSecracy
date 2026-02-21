import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0D0D0D]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-purple-500 animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default Loader;
