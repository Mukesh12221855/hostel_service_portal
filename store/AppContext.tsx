import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Complaint, Role } from '../types';

// Extended User type for internal auth (not exposed to whole app to simulate security)
interface AuthUser extends User {
  password: string;
}

interface AppContextType {
  user: User | null;
  login: (id: string, password: string) => boolean;
  signup: (id: string, name: string, password: string) => boolean;
  logout: () => void;
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'studentName' | 'studentId' | 'studentRoom'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  assignStaff: (complaintId: string, staffId: string, staffName: string) => void;
  deleteComplaint: (id: string) => void;
  staffList: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate Mock Data
const generateInitialUsers = (): AuthUser[] => {
  const users: AuthUser[] = [];
  
  // 2 Admins
  users.push({ id: 'ADMIN001', name: 'Chief Warden', email: 'warden@hostel.com', role: 'admin', password: 'password' });
  users.push({ id: 'ADMIN002', name: 'Deputy Warden', email: 'deputy@hostel.com', role: 'admin', password: 'password' });

  // 10 Staff
  const depts = ['Electrical', 'Plumbing', 'Internet', 'Furniture', 'Cleaning'];
  for(let i=1; i<=10; i++) {
    users.push({
      id: `STAFF${String(i).padStart(3, '0')}`,
      name: `Staff Member ${i}`,
      email: `staff${i}@hostel.com`,
      role: 'staff',
      department: depts[(i-1) % 5],
      password: 'password'
    });
  }

  // 20 Students
  for(let i=1; i<=20; i++) {
    users.push({
      id: `STU${String(i).padStart(3, '0')}`,
      name: `Student ${i}`,
      email: `student${i}@hostel.com`,
      role: 'student',
      roomNumber: `${100 + i}`,
      password: 'password'
    });
  }
  return users;
};

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    studentId: 'STU001',
    studentName: 'Student 1',
    studentRoom: '101',
    title: 'Fan making loud noise',
    description: 'The ceiling fan in my room is wobbling and making a very loud clicking sound.',
    category: 'Electrical',
    status: 'Pending',
    priority: 'Medium',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'c2',
    studentId: 'STU002',
    studentName: 'Student 2',
    studentRoom: '102',
    title: 'Bathroom tap leaking',
    description: 'Continuous water leakage from the main tap in the shared bathroom.',
    category: 'Plumbing',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'STAFF002',
    assignedStaffName: 'Staff Member 2',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 4000000,
  }
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize DB from local storage or defaults
  const [dbUsers, setDbUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('sh_db_users');
    return saved ? JSON.parse(saved) : generateInitialUsers();
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('sh_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  // Sync DB to local storage
  useEffect(() => {
    localStorage.setItem('sh_db_users', JSON.stringify(dbUsers));
  }, [dbUsers]);

  useEffect(() => {
    if (user) localStorage.setItem('sh_user', JSON.stringify(user));
    else localStorage.removeItem('sh_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sh_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const login = (id: string, password: string): boolean => {
    const foundUser = dbUsers.find(u => u.id === id && u.password === password);
    if (foundUser) {
      // Return user without password
      const { password, ...safeUser } = foundUser;
      setUser(safeUser);
      return true;
    }
    return false;
  };

  const signup = (id: string, name: string, password: string): boolean => {
    if (dbUsers.some(u => u.id === id)) {
      return false; // User already exists
    }
    
    const newUser: AuthUser = {
      id,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@hostel.com`,
      role: 'student',
      roomNumber: 'Unassigned', // Default
      password
    };

    setDbUsers(prev => [...prev, newUser]);
    // Automatically log in
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'studentName' | 'studentId' | 'studentRoom'>) => {
    if (!user || user.role !== 'student') return;
    
    const newComplaint: Complaint = {
      ...data,
      id: `c${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      studentRoom: user.roomNumber || 'Unknown',
      status: 'Pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, updatedAt: Date.now() } : c));
  };

  const assignStaff = (complaintId: string, staffId: string, staffName: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === complaintId 
      ? { ...c, assignedTo: staffId, assignedStaffName: staffName, status: 'In Progress', updatedAt: Date.now() } 
      : c
    ));
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const staffList = dbUsers.filter(u => u.role === 'staff').map(({ password, ...u }) => u);

  return (
    <AppContext.Provider value={{ 
      user, 
      login, 
      signup,
      logout, 
      complaints, 
      addComplaint, 
      updateComplaintStatus, 
      assignStaff, 
      deleteComplaint,
      staffList
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};