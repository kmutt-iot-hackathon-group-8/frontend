const BASE_URL =
  import.meta.env.VITE_API_URL || "https://backend-h6j3.onrender.com";

export const API = {
  // ===== EVENTS =====
  events: {
    getAll: async (date?: string, ownerId?: number) => {
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (ownerId) params.append("ownerId", ownerId.toString());

      const response = await fetch(
        `${BASE_URL}/api/v1/events?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },

    getById: async (id: number) => {
      const response = await fetch(`${BASE_URL}/api/v1/events/${id}`);
      if (!response.ok) throw new Error("Failed to fetch event");
      return response.json();
    },

    create: async (eventData: any) => {
      const response = await fetch(`${BASE_URL}/api/v1/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error("Failed to create event");
      return response.json();
    },

    update: async (id: number, updates: any) => {
      const response = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update event");
      return response.json();
    },

    delete: async (id: number) => {
      const response = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      return response.json();
    },
  },

  // ===== ATTENDEES =====
  attendees: {
    getByEventId: async (eventId: number, status?: string) => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await fetch(
        `${BASE_URL}/api/v1/events/${eventId}/attendees?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch attendees");
      return response.json();
    },

    register: async (eventId: number, userId: number) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/events/${eventId}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (!response.ok) throw new Error("Failed to register for event");
      return response.json();
    },

    add: async (eventId: number, userId: number, status?: string) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/events/${eventId}/attendees`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status }),
        }
      );
      if (!response.ok) throw new Error("Failed to add attendee");
      return response.json();
    },

    updateStatus: async (
      eventId: number,
      userId: number,
      status: "present" | "absent" | "registered"
    ) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/attendees/${eventId}/${userId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) throw new Error("Failed to update attendee status");
      return response.json();
    },

    remove: async (eventId: number, userId: number) => {
      const response = await fetch(
        `${BASE_URL}/api/v1/events/${eventId}/attendees/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to remove attendee");
      return response.json();
    },
  },

  // ===== USERS =====
  users: {
    getProfile: async (id: number) => {
      const response = await fetch(`${BASE_URL}/api/v1/users/profile/${id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },

    updateProfile: async (id: number, updates: any) => {
      const response = await fetch(`${BASE_URL}/api/v1/users/profile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },

    linkCard: async (id: number, cardId: string) => {
      const response = await fetch(`${BASE_URL}/api/v1/users/card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, cardId }),
      });
      if (!response.ok) throw new Error("Failed to link card");
      return response.json();
    },
  },

  // ===== AUTHENTICATION =====
  auth: {
    registerCard: async (cardId: string, userId: number, eventId?: number) => {
      const response = await fetch(`${BASE_URL}/api/v1/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, userId, eventId }),
      });
      if (!response.ok) throw new Error("Failed to register card");
      return response.json();
    },

    scanCard: async (cardId: string, eventId?: number) => {
      const params = new URLSearchParams();
      if (eventId) params.append("eventId", eventId.toString());
      const response = await fetch(
        `${BASE_URL}/api/v1/scan-card/${cardId}?${params.toString()}`
      );
      if (!response.ok) throw new Error("Card scan failed");
      return response.text();
    },
  },
};
