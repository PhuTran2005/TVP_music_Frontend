import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/store"; // Nhớ import từ store hooks
import { initAuth } from "@/features/auth/slice/authSlice"; // Import Thunk đã viết

export const useInitAuth = () => {
  const dispatch = useAppDispatch();
  const initialized = useRef(false); // Ref để tránh chạy 2 lần (Strict Mode)

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Chỉ cần gọi đúng 1 dòng này thôi!
    // Thunk initAuth sẽ tự động:
    // 1. Gọi API /refresh-token
    // 2. Nếu thành công -> Dispatch Login -> Tắt Loading
    // 3. Nếu thất bại -> Dispatch Logout -> Tắt Loading
    dispatch(initAuth());
  }, [dispatch]);
};
