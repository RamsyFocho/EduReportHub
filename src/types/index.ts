export interface User {
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
    firstName: string;
    lastName: string;
}

export interface Report {
    id: number;
    establishment: Establishment;
    teacher: Teacher;
    className: string;
    courseTitle: string;
    date: string;
    startTime: string;
    endTime: string;
    presentStudents: number;
    absentStudents: number;
    observation: string;
    sanctionType: "NONE" | "WARNING" | "SUSPENSION";
}
