import { apiUrl } from "./constants";
import type {
  CreateEventRequest,
  CreateEventResponse,
  EventDetails,
  GetEventDetailsResponse,
  GetEventsRequest,
  GetEventsResponse,
} from "../types/apiTypes";
import axios from "axios";

export const fetchEvents = async (
  params: GetEventsRequest = {}
): Promise<GetEventsResponse> => {
  const token = localStorage.getItem('token') || '';
  console.log('Fetching events with token:', token, 'and params:', params);

  try {
    const response = await axios.get(`${apiUrl}/event`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, 
    });
    console.log('Fetched events:', JSON.stringify(response.data, null, 2));
    return response.data as GetEventsResponse;
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      events: [],
      page: params.page || 1,
      limit: params.limit || 6,
      total: 0,
      totalPages: 0,
      message: 'No events found',
    };
  }
};

export const createEvent = async (
  newEvent: CreateEventRequest
): Promise<CreateEventResponse> => {
  try{
    console.log('+++',apiUrl)
  const response = await axios.post<CreateEventResponse>(
    `${apiUrl}/event/createEvent`,
    newEvent,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    }
  );
  if (!response.data || typeof response.data.id !== "number") {
    throw new Error("Failed to create event");
  }
  return response.data;
}catch(err){
  console.error("Error creating event:", err);
  throw new Error("Failed to create event");
}
};

export const fetchEventDetails = async (eventId: string): Promise<EventDetails | undefined> => {
  console.log("Fetching event details for ID:", eventId);
  try {
    const res = await axios.get<GetEventDetailsResponse>(
      `${apiUrl}/event/${eventId}/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
    console.log("Fetched event details:", JSON.stringify(res.data,null, 2));
    return res.data.event; 
  } catch (err) {
    console.error("Error fetching event details:", err);
    return undefined;
  }
};

export const updatedEvent = async (
  eventId: string,
  updatedData: EventDetails
): Promise<CreateEventResponse | undefined> => {
  try {
    const res = await axios.put<CreateEventResponse>(
      `${apiUrl}/event/${eventId}/update`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating event:", err);
    return undefined;
  }
}

export const upsertEvent = async (
  eventData: Partial<EventDetails>
): Promise<EventDetails> => {
  const res = await axios.post<EventDetails>(
    `${apiUrl}/event/upsertEvent`,
    eventData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    }
  );
  return res.data;
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    console.log("Deleting event with ID:", eventId);
    const response = await axios.delete(
      `${apiUrl}/event/${eventId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
    console.log("Delete event response:", response);
    return response.status === 200;
  } catch (err) {
    console.error("Error deleting event:", err);
    return false;
  }
};