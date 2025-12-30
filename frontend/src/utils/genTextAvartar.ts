export const getInitialsTextAvartar = (name: string | undefined) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/); // Tách khoảng trắng
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase(); // Tên 1 chữ -> Lấy 2 ký tự đầu
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(); // Tên nhiều chữ -> Lấy chữ đầu + chữ cuối
};
