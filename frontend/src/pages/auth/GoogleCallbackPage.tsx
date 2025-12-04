import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/store/store";
import authApi from "@/features/auth/api/authApi";
import { PulseLoader } from "@/components/ui/MusicLoadingEffects";
import { login } from "@/features";
import { toast } from "sonner";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const accessToken = searchParams.get("token");

    if (accessToken) {
      authApi
        .getMe(accessToken)
        .then((res) => {
          // ✅ SỬA Ở ĐÂY: Dữ liệu user nằm trong res.data
          const user = res.data;
          console.log(res);
          dispatch(
            login({
              accessToken,
              user: user, // Truyền user object vào đây
            })
          );
          toast.success("Welcome back!", {
            description: `Logged in successfully as ${
              user.fullName || user.username
            }`,
          });
          navigate("/");
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin user:", err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return <PulseLoader fullscreen text="Đang đăng nhập với Google..." />;
};

export default GoogleCallbackPage;
