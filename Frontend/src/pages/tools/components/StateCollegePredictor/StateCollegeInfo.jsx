import React from 'react'
import {ExclamationTriangleIcon, ArrowUpRightIcon} from "@heroicons/react/24/outline";

const StateCollegesInfo = () => {

  const colleges = [
    {
      name: "Harcourt Butler Technical University",
      short: "HBTU",
      location: "Kanpur, Uttar Pradesh",
      established: 1921,
      counselling: "UPTAC Counseling",
      website: "https://hbtu.ac.in"
    },
    {
      name: "Madan Mohan Malaviya University of Technology",
      short: "MMMUT",
      location: "Gorakhpur",
      established: 1962,
      counselling: "UPTAC Counseling",
      website: "https://mmmut.ac.in"
    },
    {
      name: "Kamla Nehru Institute of Technology",
      short: "KNIT",
      location: "Sultanpur",
      established: 1976,
      counselling: "UPTAC Counseling",
      website: "https://knit.ac.in"
    },
    {
      name: "Institute of Engineering and Technology",
      short: "IET Lucknow",
      location: "Lucknow",
      established: 1984,
      counselling: "UPTAC Counseling",
      website: "https://ietlucknow.ac.in"
    },
    {
      name: "Bundelkhand Institute of Engineering & Technology",
      short: "BIET",
      location: "Jhansi",
      established: 1986,
      counselling: "UPTAC Counseling",
      website: "https://bietjhs.ac.in"
    },
    {
      name: "Government Engineering College",
      short: "GEC Jhansi",
      location: "Jhansi",
      established: 2007,
      counselling: "UPTAC Counseling",
      website: "https://gecjhansi.ac.in"
    },
    {
      name: "Rajkiya Engineering College",
      short: "REC Banda",
      location: "Banda",
      established: 2010,
      counselling: "UPTAC Counseling",
      website: "https://recbanda.ac.in"
    },
    {
      name: "Ajay Kumar Garg Engineering College",
      short: "AKGEC",
      location: "Ghaziabad",
      established: 1998,
      counselling: "UPTAC Counseling",
      website: "https://akgec.ac.in"
    },
    {
      name: "GLA University",
      short: "GLA",
      location: "Mathura",
      established: 1991,
      counselling: "UPTAC / Direct",
      website: "https://gla.ac.in"
    },
    {
      name: "Dr. A.P.J. Abdul Kalam Technical University",
      short: "AKTU",
      location: "Lucknow",
      established: 2000,
      counselling: "Counseling Authority",
      website: "https://aktu.ac.in"
    }
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-5 md:p-6 mb-8">

      {/* HEADER */}
      <div className="mb-6 border-b border-gray-300 pb-3">

        <div className="flex items-center gap-3">

          <div className="w-1.5 h-6 bg-blue-900" />

          <h3 className="text-lg md:text-xl font-semibold text-blue-900">
            Top State Engineering Colleges
          </h3>

        </div>

        <p className="text-sm text-gray-600 mt-1 ml-4">
          Institutes participating through UPTAC / AKTU Counseling
        </p>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm border border-gray-300">

          {/* HEAD */}
          <thead className="bg-blue-900 text-white">

            <tr>
              <th className="text-left px-4 py-3 border">Institute</th>
              <th className="text-left px-4 py-3 border">Location</th>
              <th className="text-left px-4 py-3 border">Established</th>
              <th className="text-left px-4 py-3 border">Counseling</th>
              <th className="text-left px-4 py-3 border">Official Website</th>
            </tr>

          </thead>

          {/* BODY */}
          <tbody className="text-gray-800">

            {colleges.map((college, index) => (

              <tr
                key={index}
                className="hover:bg-gray-50"
              >

                <td className="px-4 py-3 border">

                  <div className="font-medium text-gray-900">
                    {college.name}
                  </div>

                  <div className="text-xs text-gray-500">
                    {college.short}
                  </div>

                </td>

                <td className="px-4 py-3 border">
                  {college.location}
                </td>

                <td className="px-4 py-3 border">
                  {college.established}
                </td>

                <td className="px-4 py-3 border">

                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-900 border border-blue-300">
                    {college.counselling}
                  </span>

                </td>

                <td className="px-4 py-3 border">

                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 hover:underline flex items-center gap-1 font-medium"
                  >
                    Visit
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* WARNING BOX */}
      <div className="mt-6 border border-red-300 bg-red-50 p-4 rounded-md">

        <div className="flex items-start gap-2">

          <ExclamationTriangleIcon className="h-5 w-5 text-red-700 mt-0.5" />

          <p className="text-sm text-red-800">

            Institute participation, seat availability, and counseling
            procedures may change every year.

            <br />

            Please verify all details from the official UPTAC counseling
            portal and respective institute websites before admission.

          </p>

        </div>

      </div>

    </div>
  );

};

export default StateCollegesInfo;