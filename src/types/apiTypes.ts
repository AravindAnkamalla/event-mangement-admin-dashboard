// API Types for backend integration
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
  accessToken: string;
  refreshToken: string;
  data?: LoginResponse; // Some APIs wrap the response in a data field
};

export type GetEventsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  events: any[]; // Will be mapped to Event type
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
  registrationDate: string;
}

export interface EventDetails {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  address: string;
  eventType: string;
  eventStatus: string;
  organizerName: string;
  organizerContact: string;
  imageUrl: string;
  registeredUsers: RegisteredUser[];
}

export interface GetEventDetailsResponse {
  message: string;
  event: EventDetails;
}

export interface CreateUserInput {
  username: string;
  email: string;
  mobile?: string;
  password?: string;
  role: 'ADMIN' | 'USER';
}

export interface CreateUserResponse {
  id: number;
  message: string;
}

export interface DeleteUserResponse {
  message: string;
}

export interface GetUserDetailsResponse {
  user: any; // Will be mapped to User type
  message: string;
}

export interface UpsertEventInput {
  id?: number;
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  address: string;
  eventType: string;
  organizerName: string;
  organizerContact: string;
  imageUrl: string;
}
