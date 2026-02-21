import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const Footer = ({ type = "UPTAC" }) => {

  /* ===== CONFIG BASED ON TYPE ===== */

  const config = {

    UPTAC: {
      portalName: "State College Predictor Portal",
      description:
        "This platform provides admission predictions for state engineering colleges based on historical cutoff data released by UPTAC and respective state counselling authorities.",

      sources: [
        {
          name: "UPTAC Counseling Portal",
          link: "https://uptac.admissions.nic.in",
        },
        {
          name: "AKTU Official Website",
          link: "https://aktu.ac.in",
        },
        {
          name: "JEE Main NTA Portal",
          link: "https://jeemain.nta.nic.in",
        },
      ],

      authorityNote:
        "Data compiled from UPTAC and State Counseling Authorities.",
    },


    JOSAA: {
      portalName: "Central College Predictor Portal",
      description:
        "This platform provides admission predictions for IITs, NITs, IIITs and GFTIs based on historical cutoff data released by JoSAA and CSAB counselling authorities.",

      sources: [
        {
          name: "JoSAA Official Website",
          link: "https://josaa.nic.in",
        },
        {
          name: "CSAB Special Rounds",
          link: "https://csab.nic.in",
        },
        {
          name: "JEE Main NTA Portal",
          link: "https://jeemain.nta.nic.in",
        },
      ],

      authorityNote:
        "Data compiled from JoSAA & CSAB Counseling Authorities.",
    },
  };

  const current = config[type] || config.UPTAC;


  return (
    <footer className="mt-12 border-t border-gray-300 bg-white text-gray-800">

      <div className="container mx-auto px-4 py-8">

        {/* ===== TOP GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ===== PORTAL INFO ===== */}
          <div>

            <h4 className="text-blue-900 font-semibold text-sm md:text-base mb-3">
              {current.portalName}
            </h4>

            <p className="text-xs md:text-sm leading-relaxed text-gray-700">
              {current.description}
            </p>

            <p className="text-xs text-gray-600 mt-3">
              Developed for informational and educational purposes only.
            </p>

          </div>


          {/* ===== DATA SOURCES ===== */}
          <div>

            <h4 className="text-blue-900 font-semibold text-sm md:text-base mb-3">
              Official Data Sources
            </h4>

            <ul className="space-y-2 text-xs md:text-sm">

              {current.sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline text-gray-800"
                  >
                    <ArrowUpRightIcon className="h-4 w-4 text-blue-900" />
                    {src.name}
                  </a>
                </li>
              ))}

            </ul>

          </div>


          {/* ===== HELP SUPPORT ===== */}
          <div>

            <h4 className="text-blue-900 font-semibold text-sm md:text-base mb-3">
              Help & Support
            </h4>

            <ul className="space-y-2 text-xs md:text-sm text-gray-700">

              <li>Admission Guidance & Counseling Support</li>
              <li>Cutoff Data & Prediction Queries</li>
              <li>Technical Assistance</li>

            </ul>

            <div className="mt-3 text-xs text-gray-700">

              <p>Email: helpcollegesecracy@gmail.com</p>
              <p>Response Time: 24 – 48 Hours</p>

            </div>

          </div>

        </div>


        {/* ===== DIVIDER ===== */}
        <div className="border-t border-gray-300 mt-8 pt-6">

          {/* Disclaimer */}
          <p className="text-xs text-gray-600 leading-relaxed">

            Disclaimer: Admission predictions are generated using previous
            years’ cutoff trends and analytical algorithms. Actual seat
            allotment may vary depending on factors such as seat availability,
            reservation policies, applicant volume, and counselling authority
            decisions. Candidates are strongly advised to refer to the official
            counselling portals for final admission information.

          </p>


          {/* Copyright */}
          <div className="mt-4 text-xs text-gray-800  flex flex-col md:flex-row justify-between gap-2">

            <span>
              © {new Date().getFullYear()} {current.portalName}. All Rights Reserved.
            </span>

            <span>
              {current.authorityNote}
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
