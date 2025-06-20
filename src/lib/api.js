// API utility for backend requests

const API_BASE = import.meta.env.VITE_BACKEND_URI;

export async function fetchJobs(token) {
  const res = await fetch(`${API_BASE}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function fetchNotifications(token) {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function fetchUser(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}

export async function createJob(token, jobData) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

export async function sendNotification(token, message) {
  const res = await fetch(`${API_BASE}/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Failed to send notification");
  return res.json();
}
