import type { Event, User } from "../types";
import axios from "axios";
import type {
  CreateUserInput,
  CreateUserResponse,
  DeleteUserResponse,
  GetUserDetailsResponse,
  LoginResponse,
} from "../types/apiTypes";
import { apiUrl } from "./constants";

export const fetchUsers = async (): Promise<User[]> => {
  let response: any;
  try {
    const token = localStorage.getItem("token") || "";
    response = await axios
      .get(`${apiUrl}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
      console.log("Fetched users:", response);
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
  if (response !== undefined) {
    const users: User[] = response.users;
    console.log(users);
    return users;
  }
  return [];
};

export const fetchUserById = async (
  userId: string
): Promise<User | undefined> => {
  console.log("Fetching user details for ID:", userId);
  try {
    const res = await axios.get<GetUserDetailsResponse>(
      `${apiUrl}/admin/users/${userId}/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );

    return res.data.user;
  } catch (err) {
    console.error("Error fetching user details:", err);
    return undefined;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    console.log("Deleting user with ID:", userId);
    const response = await axios.delete<DeleteUserResponse>(
      `${apiUrl}/admin/users/${userId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
    console.log("Delete response:", response);
    return response.status === 200;
  } catch (err) {
    console.error("Error deleting user:", err);
    return false;
  }
};

export const removeEventFromUsers = (eventId: string) => {};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse | null> => {
  let response: any;
  try {
    response = await axios
      .post(`${apiUrl}/auth/login/`, { email, password })
      .then((res) => res.data);
  } catch (err) {
    console.error("Login failed:", err);
    response = undefined;
  }
  if (response !== undefined) {
    const loginResponse: LoginResponse = response.data;
    localStorage.setItem("token", loginResponse.accessToken);
    console.log(loginResponse);
    return loginResponse;
  }

  return null;
};

export const resetPasswordEmail = async (email: string): Promise<boolean> => {
  return false;
};

export const upsertUser = async (
  data: CreateUserInput & { id?: number }
): Promise<CreateUserResponse> => {
  const response = await axios.post<CreateUserResponse>(
    `${apiUrl}/admin/users/upsert`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    }
  );
  return response.data;
};