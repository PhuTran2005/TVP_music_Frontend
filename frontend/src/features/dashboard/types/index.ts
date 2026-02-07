// --- 1. COMMON TYPES ---

// Kiểu dữ liệu cho 1 điểm trên biểu đồ
export interface ChartDataPoint {
  _id: string; // Format: "YYYY-MM-DD"
  count: number; // Số lượng
}

// Kiểu dữ liệu cho 1 ô thống kê (Card Overview)
export interface StatItem {
  value: number;
  growth: number; // % tăng trưởng
}

// --- 2. SYSTEM HEALTH TYPES (DevOps - Updated) ---

export interface CloudinaryStats {
  plan: string;
  bandwidth: {
    usage: number;
    usageReadable: string; // 🔥 NEW: "350 MB" (Backend format sẵn)
    limit: number;
    limitReadable: string; // 🔥 NEW: "25 GB"
    percent: number; // 🔥 NEW: 1.4
  };
  storage: {
    usage: number;
    usageReadable: string; // 🔥 NEW
    limit: number;
  };
}

export interface B2Stats {
  status: "online" | "offline";
  bucketName: string;
  bucketType: string;
  error?: string;
}

export interface UpstashStats {
  dailyRequests: number;
  monthlyRequests: number;
  dataSize: number;
  dataSizeReadable: string; // 🔥 NEW: "5 MB" (Backend format sẵn)
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

// Cấu trúc System Health tổng hợp
export interface SystemHealthData {
  storage: {
    dbTotalBytes: number;
    dbReadable: string; // VD: "15.5 GB" (Dung lượng file thực tế, đại diện cho B2)
    b2Status: B2Stats | null;
    cloudinary: CloudinaryStats | null;
  };
  queue: QueueStats;
  trackStatus: {
    ready: number;
    failed: number;
    pending: number;
    processing: number;
  };
  redis: {
    memory: string; // VD: "10.5 MB" (Lấy trực tiếp từ connection)
    upstash: UpstashStats | null;
  };
}

// --- 3. TOP LISTS TYPES ---

export interface TopTrack {
  _id: string;
  title: string;
  coverImage: string;
  playCount: number; // Khớp với DB field
  artist: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface TopArtist {
  _id: string;
  name: string;
  avatar: string;
  totalPlays: number;
}

// --- 4. MAIN RESPONSE STRUCTURE ---

// Cấu trúc dữ liệu chính (Data Payload)
export interface DashboardData {
  overview: {
    users: StatItem;
    tracks: StatItem;
    albums: StatItem;
    plays: StatItem;
    activeUsers24h: number;
  };
  systemHealth: SystemHealthData;
  charts: {
    userGrowth: ChartDataPoint[];
    trackGrowth: ChartDataPoint[];
  };
  topLists: {
    topTracks: TopTrack[];
    topArtists: TopArtist[];
  };
}

// API Response Wrapper (Chuẩn JSend)
export interface DashboardResponse {
  status: string;
  data: DashboardData;
}
