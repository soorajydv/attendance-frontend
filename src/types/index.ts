// Base types
export interface BaseEntity {
  _id?:string
  id?: string
  createdAt?: string
  updatedAt?: string
}

// enums.ts
export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export enum UserRole {
  Admin = "ADMIN",
  Teacher = "TEACHER",
  Student = "STUDENT",
  Staff = "STAFF",
}

export interface User extends BaseEntity {
  fullName: string
  email: string
  phoneNumber: string
  gender: Gender
  role: UserRole
  dateOfBirth?: string
  address?: any
  avatar?: string
  isVerified?: boolean
  busId?: string; // Optional property, as per Zod schema
  classId?: string | any; 
  sectionId?: string | any; 
}

// Teacher extends User
export interface Teacher extends User {
  data?: Teacher
  organizationId: string
  isLogin: boolean
  subjects?: string[]
  classes?: string[]
  schedule?:any
}

// Student extends User
export interface Student extends User {
  classId: {
    name:string
    section: string
  }
  sectionId: {
    name:string
    section: string
  }
}

export interface Subject extends BaseEntity {
  name: string;
  code?:string;
  description?:string
};

export interface Class extends BaseEntity {
  studentCount: number
  isActive(isActive: any): import("react").ReactNode
  user?: any
  name: string
  code?: string
}

export interface Bus extends BaseEntity {
  driverId?: string
  busNumber: string
  route: string
}

export interface Event extends BaseEntity {
  title: string
  class: string
  date: string
  startTime: string
  endTime: string
}

export interface Announcement extends BaseEntity {
  title: string
  class: string
  date: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData extends LoginFormData {
  confirmPassword?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Table types
export interface TableColumn {
  header: string
  accessor: string
  className?: string
}

// Auth types
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface Section extends BaseEntity{
  name: string;
  classId: string | Class; // String if just an ID, or full `Class` object if populated
}

export interface DropdownOption {
  _id?: string | undefined
  id?: string | undefined
  name: string
  [key: string]: any
}


export interface Schedule {
  _id: string;
  organizationId: string;
  classId: string;
  className: string;
  sectionId: string;
  section: string;
  subjectId: string;
  subject: string;
  teacherId: string;
  periodId: string;
  period: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  status: 'active' | 'inactive' | 'draft';
  isRecurring: boolean;
  recurrenceEndDate?: string;
  notes?: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  periodId: string;
  day: string;
  status?: 'active' | 'inactive' | 'draft';
  isRecurring?: boolean;
  recurrenceEndDate?: string;
  notes?: string;
}

export interface UpdateScheduleData extends Partial<CreateScheduleData> {
  _id: string;
}

export interface ScheduleFilters {
  search?: string;
  status?: string;
  day?: string;
}

export interface ScheduleOptions {
  subjects: Array<{ _id: string; name: string }>;
  classes: Array<{ _id: string; name: string }>;
  sections: Array<{ _id: string; name: string; classId: string }>;
  periods: Array<{ _id: string; name: string; startTime: string; endTime: string }>;
}
