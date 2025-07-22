// Define types for better type safety with TypeScript

export type Role = 'ADMIN' | 'USER';

export type InvitationStatus = 'READY' | 'SENT';

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export type User = {
  id: number;
  username: string;
  email: string;
  mobile: string | null;
  role: Role;
  invitation: InvitationStatus;
  createdBy: Role;
  createdAt: Date;
  updatedBy: Role;
  updatedAt: Date;
  isFirstLogin: boolean;
};

export interface Event {
  id: number;
  name: string;
  description?: string;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  address: string;
  eventType: string;
  eventStatus: EventStatus;
  organizerName: string;
  organizerContact: string;
  imageUrl?: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type GetEventsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  events: Event[];
  message: string;
};

export type GetUsersResponse = {
  users: User[];
  message: string;
};

export type CreateEventRequest = {
  name: string;
  description?: string;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  address: string;
  eventType: string;
  organizerName: string;
  organizerContact: string;
  imageUrl?: string;
};

export type CreateEventResponse = {
  id: number;
  message: string;
};

export type GetEventsRequest = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export enum RegistrationStatus {
  REGISTERED = "REGISTERED",
  CANCELLED = "CANCELLED",
}

export interface RegisteredUser {
  id: number;
  username: string;
  email: string;
  mobile: string;
  registrationStatus: RegistrationStatus;
  registrationDate: string; // ISO string format
}

export interface EventDetails {
  id: number;
  name: string;
  description: string;
  eventDate: string; // ISO Date string
  startTime: string; // ISO Time string
  endTime: string; // ISO Time string
  address: string;
  eventType: string;
  eventStatus: string; // or you can use an enum EventStatus if defined
  organizerName: string;
  organizerContact: string;
  imageUrl: string;
  registeredUsers: RegisteredUser[];
}

export interface GetEventDetailsResponse {
  message: string;
  event: EventDetails;
}

export type GetUserDetailsResponse = {
  user: User;
  message: string;
};

export interface CreateUserInput {
  username: string;
  email: string;
  mobile?: string;
  password?: string;
  role: Role;
}

export interface CreateUserResponse {
  id: number;
  message: string;
}

export interface DeleteUserResponse {
  message: string;
}

// Additional types for the dashboard
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}