import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Navbar = ({ type = "UPTAC" }) => {

  /* ===== CONFIG BASED ON TYPE ===== */

  const config = {
    UPTAC: {
      title: "STATE COLLEGE PREDICTOR",
      subtitle: "Cutoff-Based Admission Prediction System",
      authority: "UPTAC / State Counseling Bodies"
    },

    JOSAA: {
      title: "CENTRAL COLLEGE PREDICTOR",
      subtitle: "JoSAA / CSAB Admission Prediction System",
      authority: "JoSAA / CSAB Counseling Authority"
    }
  };

  const current = config[type] || config.UPTAC;


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-300">

      <div className="container mx-auto px-3 sm:px-4">

        {/* ===== MOBILE HEADER ===== */}
        <div className="md:hidden py-2 text-center relative">

          {/* Back icon minimal */}
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          <h1 className="text-sm font-bold text-blue-900 tracking-wide">
            {current.title}
          </h1>

          <p className="text-[10px] text-gray-600">
            {current.authority}
          </p>

        </div>


        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:flex items-center justify-between h-[64px]">

          {/* LEFT — Back + Portal Tag */}
          <div className="flex items-center gap-3 min-w-[200px]">

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-semibold transition"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>

            <span className="text-xs text-gray-500 border-l pl-3">
              Admission Portal
            </span>

          </div>


          {/* CENTER — Title */}
          <div className="text-center flex-1">

            <h1 className="text-xl font-bold text-blue-900 tracking-wide leading-tight">
              {current.title}
            </h1>

            <p className="text-xs text-gray-600">
              {current.subtitle}
            </p>

          </div>


          {/* RIGHT — Authority */}
          <div className="text-right min-w-[200px]">

            <p className="text-xs text-gray-500">
              Counseling Authority
            </p>

            <p className="text-sm font-bold text-blue-900">
              {current.authority}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
