/**
 * Tự động xác định mã quốc gia dựa trên IP của người dùng
 * @returns {Promise<string | null>} Mã quốc gia ISO (VD: "VN")
 */
export const detectUserCountry = async (): Promise<string | null> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.error("Auto-detect country failed:", error);
    return null;
  }
};
