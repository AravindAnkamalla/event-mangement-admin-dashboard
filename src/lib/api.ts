// Re-export all API functions from separate modules
export * from "./eventApi";
export * from "./userApi";
export * from "./constants";

// Legacy exports for compatibility (will be removed)
import {
  fetchEvents,
  createEvent,
  deleteEvent as deleteEventApi,
  updatedEvent,
  upsertEvent,
} from "./eventApi";
import {
  fetchUsers,
  deleteUser as deleteUserApi,
  upsertUser,
  loginUser,
} from "./userApi";
import type {
  GetEventsRequest,
  GetEventsResponse,
  CreateEventRequest,
  CreateEventResponse,
  CreateUserInput,
  CreateUserResponse,
  DeleteUserResponse,
  LoginResponse,
  UpsertEventInput,
} from "../types/apiTypes";

export const eventsAPI = {
  getEvents: async (params: GetEventsRequest): Promise<GetEventsResponse> => {
    return fetchEvents(params);
  },

  upsertEvent: async (data: UpsertEventInput): Promise<CreateEventResponse> => {
    const event = await upsertEvent(data);
    return { id: event.id, message: "Event upserted successfully" };
  },

  updateEvent: async (
    id: number,
    data: Partial<CreateEventRequest>
  ): Promise<void> => {
    await updatedEvent(id.toString(), data as any);
  },

  deleteEvent: async (id: number): Promise<void> => {
    await deleteEventApi(id.toString());
  },
};

export const usersAPI = {
  getUsers: async () => {
    const users = await fetchUsers();
    return { users, message: "Success" };
  },

  createUser: async (data: CreateUserInput): Promise<CreateUserResponse> => {
    return upsertUser(data);
  },

  updateUser: async (
    id: number,
    data: Partial<CreateUserInput>
  ): Promise<void> => {
    if (data.username && data.email && data.role) {
      await upsertUser({
        username: data.username,
        email: data.email,
        role: data.role,
        mobile: data.mobile,
        password: data.password,
        id,
      });
    }
  },

  deleteUser: async (id: number): Promise<DeleteUserResponse> => {
    await deleteUserApi(id.toString());
    return { message: "User deleted successfully" };
  },
};

export const authAPI = {
  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const result = await loginUser(data.email, data.password);
    if (!result) {
      throw new Error("Login failed");
    }
    return result;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
  },
};
