import api from "@/lib/axios";

/* ---------------- GET AVAILABLE YEARS ---------------- */

export const getAvailableYears = async () => {
  try {
    const res = await api.get(
      `/api/v1/mentee/get-college-data/available-years`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.status === "success") {
      return res.data.years; // [2024, 2023, 2022]
    }

    throw new Error(res.data.message || "Failed to fetch years");
  } catch (error) {
    console.error("Years API Error:", error);

    throw new Error(
      error.response?.data?.message ||
        "Unable to fetch available years"
    );
  }
};

/* ---------------- FETCH COLLEGE DATA ---------------- */

export const fetchCollegeData = async (
  counsellingType,
  round,
  year
) => {
  try {
    console.log("Fetch Params →", {
      counsellingType,
      round,
      year,
    });

    /* -------- GET LATEST YEAR DYNAMICALLY -------- */

    let effectiveYear = year;

    if (!year || year === "current") {
      const years = await getAvailableYears();

      if (!years || years.length === 0) {
        throw new Error("No counselling data available");
      }

      // Latest year auto pick
      effectiveYear = Math.max(...years);
    }

    /* -------- BUILD URL -------- */

    let url = `/api/v1/mentee/get-college-data/${counsellingType}`;
    url += `/${effectiveYear}/${round}`;

    /* -------- API CALL -------- */

    const response = await api.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    /* -------- RESPONSE TRANSFORM -------- */

    if (response.data.status === "success") {
      return {
        counsellingType:
          response.data.counsellingType ||
          counsellingType,

        round: round,
        year: effectiveYear,

        data: response.data.data.map((college) => ({
          Institute: college.Institute,

          "Academic Program Name":
            college.Program ||
            college["Academic Program Name"],

          Quota: college.Quota,

          "Seat Type":
            college["Seat Type"] ||
            college.Category,

          Gender:
            college.Gender ||
            college["Seat Gender"],

          "Opening Rank":
            college["Opening Rank"],

          "Closing Rank":
            college["Closing Rank"],

          Round: college.Round,
          State: college.State,
          Category: college.Category,
        })),

        dataCount: response.data.data.length,
        requestedAt: new Date().toISOString(),
      };
    }

    throw new Error(
      response.data.message ||
        "Invalid response format"
    );
  } catch (error) {
    /* -------- ERROR HANDLING -------- */

    let errorMessage =
      "Failed to fetch college data";

    if (error.response) {
      if (error.response.status === 404) {
        return {
          counsellingType,
          round,
          year,
          data: [],
          dataCount: 0,
          requestedAt: new Date().toISOString(),
        };
      }

      if (error.response.status === 401) {
        errorMessage =
          "Session expired - please login again";
      } else if (error.response.status === 403) {
        errorMessage =
          "Your account does not have access to this data";
      } else {
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      }
    } else if (
      error.message.includes("Network Error")
    ) {
      errorMessage =
        "Cannot connect to server - check your internet connection";
    }

    throw new Error(errorMessage);
  }
};
