export type Role = 'student' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string; // For staff (e.g., Electrical, Plumbing)
  roomNumber?: string; // For students
}

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export type Category = 'Electrical' | 'Plumbing' | 'Internet' | 'Furniture' | 'Cleaning' | 'Other';

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  studentRoom: string;
  title: string;
  description: string;
  category: Category;
  status: ComplaintStatus;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  assignedTo?: string; // Staff ID
  assignedStaffName?: string;
  adminComments?: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}