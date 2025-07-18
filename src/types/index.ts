
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
    id: number;
    establishment: { id: number, name: string };
    teacher: { id: number, firstName: string; lastName: string };
    className: string;
    courseTitle: string;
    date: string;
    startTime: string;
    endTime: string;
    presentStudents: number;
    absentStudents: number;
    totalStudents: number;
    observation: string;
    sanctionType: "NONE" | "WARNING" | "SUSPENSION" | "COMMENDATION";
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
        username: string;
        email: string;
    }
}
