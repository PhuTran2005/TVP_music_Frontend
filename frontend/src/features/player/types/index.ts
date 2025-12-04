// 1. Định nghĩa lại kiểu dữ liệu Track (Khớp với dữ liệu từ API Backend)
export interface Track {
  _id: string;
  title: string;
  artist: {
    _id: string;
    name: string;
    avatar?: string;
  };
  album?: {
    _id: string;
    title: string;
    coverImage?: string;
  };
  hlsUrl?: string; // Link stream HLS
  originalUrl: string; // Link dự phòng
  coverImage?: string;
  duration: number;
}
