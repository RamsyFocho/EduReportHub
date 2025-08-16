

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
  address?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export interface Establishment {
    id: number;
    name: string;
}

export interface Teacher {
    id: number;
    teacherId?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface Report {
    deletedAt: any;
    deletionReason: any;
    reportId: number;
    className: string;
    studentNum: number;
    studentPresent: number;
    date: string;
    startTime: string;
    endTime: string;
    courseTitle: string;
    observation: string;
    sanctionType: "NONE" | "WARNING" | "SUSPENSION" | "COMMENDATION" | null;
    establishmentName: string;
    teacherFullName: string;
    email: string;
    phoneNumber: string | null;
    role: { id: number; name: string; }[];
    description: string | null;
    dateIssued: string | null;
    createdAt?: string;
    updatedAt?: string;
    absentStudents?: number; // Keep for potential use in details
    deleted?: boolean;
    deletedBy?: [];
}
