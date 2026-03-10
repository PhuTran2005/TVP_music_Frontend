import type { User } from "../types";
import { type AdminUserFormValues } from "../schemas/user.schema";

export const USER_DEFAULT_VALUES: AdminUserFormValues = {
  fullName: "",
  email: "",
  role: "user",
  isActive: true,
  isVerified: false,
  password: "",
  avatar: null,
  bio: "",
};

export const mapUserToForm = (user?: User | null): AdminUserFormValues => {
  if (!user) return USER_DEFAULT_VALUES;

  return {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    password: "", // Không bao giờ map password từ DB ngược về form
    avatar: user.avatar || null,
    bio: user.bio || "",
  };
};
