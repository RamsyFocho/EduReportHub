
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
    description?: string | null;
    dateIssued?: string | null;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: {
        id: number;
        username: string;
        email: string;
    }
}
