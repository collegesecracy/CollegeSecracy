import {
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  ArrowUpRightIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import UPTACLogo from "@/assets/uptac-logo.webp";

const UPTACCounselingInfo = () => {

  const scheduleItems = [
    "Registration Start",
    "Registration End",
    "Choice Filling & Locking",
    "Seat Allotment Result",
    "Document Verification",
    "Institute Reporting"
  ];

  const reportingCenters = [
    "Allotted Institute Campus",
    "AKTU Zonal Verification Centers",
    "Government Engineering Colleges",
    "Designated Facilitation Centers",
    "Other Authorized Help Centers"
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-5 md:p-6 mb-8">

      {/* HEADER */}
      <div className="border-b border-gray-300 pb-3 mb-6">

        <div className="flex items-center gap-3">

          <img
            src={UPTACLogo}
            alt="UPTAC Logo"
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
            loading="lazy"
          />

          <div>

            <h3 className="text-lg md:text-xl font-semibold text-blue-900">
              UPTAC Counseling Information
            </h3>

            <p className="text-xs md:text-sm text-gray-600">
              Uttar Pradesh Technical Admission Counseling (AKTU)
            </p>

          </div>

        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ---------------- SCHEDULE ---------------- */}
        <div>

          <div className="flex items-center gap-2 mb-4">

            <ClipboardDocumentListIcon className="h-5 w-5 text-blue-900" />

            <h4 className="font-semibold text-blue-900 text-sm md:text-base">
              Counseling Schedule
            </h4>

          </div>

          <div className="border border-gray-300">

            {scheduleItems.map((item, index) => (

              <div
                key={index}
                className={`flex justify-between items-center px-4 py-3 text-xs md:text-sm
                ${index !== scheduleItems.length - 1 && "border-b border-gray-300"}
                hover:bg-gray-50`}
              >

                <span className="font-medium text-gray-800">
                  {item}
                </span>

                <span className="text-[10px] md:text-xs px-2 py-1 border border-yellow-400 bg-yellow-50 text-yellow-800">
                  To be Announced
                </span>

              </div>

            ))}

          </div>

          {/* NOTE */}
          <div className="mt-4 border border-yellow-300 bg-yellow-50 p-3 rounded-md">

            <p className="text-xs text-yellow-900 leading-relaxed">
              Counseling dates are released officially by AKTU / UPTAC.
              Candidates are advised to regularly check the official
              counseling portal for schedule updates.
            </p>

          </div>

        </div>

        {/* ---------------- REPORTING ---------------- */}
        <div>

          <div className="flex items-center gap-2 mb-4">

            <BuildingLibraryIcon className="h-5 w-5 text-blue-900" />

            <h4 className="font-semibold text-blue-900 text-sm md:text-base">
              Reporting & Verification Centers
            </h4>

          </div>

          <div className="border border-gray-300 divide-y">

            {reportingCenters.map((center, index) => (

              <div
                key={index}
                className="flex items-start gap-3 px-4 py-3 text-xs md:text-sm hover:bg-gray-50"
              >

                <span className="min-w-[22px] h-[22px] flex items-center justify-center text-[10px] border border-blue-900 text-blue-900">
                  {index + 1}
                </span>

                <span className="text-gray-800 leading-relaxed">
                  {center}
                </span>

              </div>

            ))}

          </div>

          {/* ADVISORY */}
          <div className="mt-4 border border-red-300 bg-red-50 p-3 rounded-md">

            <div className="flex gap-2">

              <ExclamationTriangleIcon className="h-5 w-5 text-red-700 mt-0.5" />

              <p className="text-xs text-red-900 leading-relaxed">

                Reporting institutes and verification centers may vary
                every counseling round.

                <br /><br />

                Candidates must refer to their allotment letter and the
                official UPTAC portal for exact reporting location and
                verification instructions.

              </p>

            </div>

          </div>

          {/* CTA */}
          <div className="mt-5">

            <a
              href="https://uptac.admissions.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs md:text-sm
              bg-blue-900 text-white px-4 py-2 border border-blue-900
              hover:bg-blue-800 transition-colors"
            >

              <ArrowUpRightIcon className="h-4 w-4" />

              Visit Official Counseling Portal

            </a>

          </div>

        </div>

      </div>

    </div>
  );

};

export default UPTACCounselingInfo;