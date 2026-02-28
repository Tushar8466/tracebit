import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const mlAPI = axios.create({
    baseURL: ML_SERVICE_URL,
});

export const classifyCodeDiff = async (code: string, language: string = "python") => {
    try {
        const { data } = await mlAPI.post("/classify", {
            code,
            language,
        });
        return data;
    } catch (error) {
        console.error("Error communicating with ML Service:", error);
        // Fallback if ML service is down
        return {
            label: "Human",
            confidence: 0.5,
        };
    }
};
