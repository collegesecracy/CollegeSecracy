import { create } from "zustand";
import api from "../lib/axios.js";

const useEmailStore = create((set) => ({
  isSending: false,

  sendPredictorEmail: async (formData) => {
    set({ isSending: true });

    try {
      const response = await api.post(
        "/api/v1/email/send-with-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ isSending: false });
    }
  },
}));

export default useEmailStore;