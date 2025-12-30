// Định nghĩa range thời gian
export type DashboardRange = "7d" | "30d" | "90d";

// Kiểu dữ liệu cho 1 điểm trên biểu đồ
export interface ChartDataPoint {
  date: string;
  value: number;
}

// Kiểu dữ liệu cho 1 ô thống kê (Card Overview)
export interface StatItem {
  value: number;
  growth: number; // % tăng trưởng
}

// Top Track
export interface TopTrack {
  _id: string;
  title: string;
  coverImage: string;
  plays: number;
  artist: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

// Top Artist
export interface TopArtist {
  _id: string;
  name: string;
  avatar: string;
  totalPlays: number;
}

// Cấu trúc dữ liệu chính (Data Payload)
export interface DashboardData {
  overview: {
    users: StatItem;
    tracks: StatItem;
    albums: StatItem;
    plays: StatItem;
  };
  charts: {
    userGrowth: ChartDataPoint[];
    trackGrowth: ChartDataPoint[];
  };
  topLists: {
    topTracks: TopTrack[];
    topArtists: TopArtist[];
  };
}

// API Response Wrapper (Chuẩn JSend mà BE trả về)
export interface DashboardResponse {
  status: string;
  data: DashboardData;
}
