
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
    // Handling both potential structures
    id?: number;
    reportId: number;
    establishment?: { id: number, name: string };
    teacher?: { id: number, firstName: string; lastName: string };
    className: string;
    courseTitle: string;
    date: string;
    startTime: string;
    endTime: string;
    presentStudents?: number;
    absentStudents?: number;
    totalStudents?: number;
    studentNum?: number; // from new structure
    studentPresent?: number; // from new structure
    observation: string;
    sanctionType: "NONE" | "WARNING" | "SUSPENSION" | "COMMENDATION" | null;
    description: string | null;
    dateIssued: string | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: {
        id: number;
        username: string;
        email: string;
    }
}
