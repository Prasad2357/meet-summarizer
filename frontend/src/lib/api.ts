const API_BASE_URL = import.meta.env.VITE_API_URL
// const IP_ADDRESS = "127.0.0.1:8000"
// const API_BASE_URL = `http://${IP_ADDRESS}`

// Helper function to handle API responses
async function handleResponse(response: Response) {
  // If token is invalid/expired, clear auth and redirect to login
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    // Redirect to login page
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    throw new Error("Session expired. Please log in again.");
  }
  return response;
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchMeetings(limit = 50, skip = 0) {
  const res = await fetch(
    `${API_BASE_URL}/records/?limit=${limit}&skip=${skip}`,
    {
      headers: getAuthHeaders(),
    }
  )

  await handleResponse(res); // Check for 401 and handle logout

  if (!res.ok) {
    throw new Error("Failed to fetch meetings")
  }
  return res.json()
}


export async function fetchMeetingById(id: string) {
  const res = await fetch(
    `${API_BASE_URL}/records/${id}/`,
    {
      headers: getAuthHeaders(),
    }
  )

  await handleResponse(res);

  if (!res.ok) {
    throw new Error("Failed to fetch meeting")
  }
  return res.json()
}

export async function fetchMeetingStatus(id: number) {
  const res = await fetch(
    `${API_BASE_URL}/records/${id}/`,
    {
      headers: getAuthHeaders(),
    }
  )

  await handleResponse(res);

  if (!res.ok) {
    throw new Error("Failed to fetch meeting status")
  }
  return res.json()
}

export async function uploadAudio(file: File) {
  const token = localStorage.getItem("access_token");
  const formData = new FormData()
  formData.append("file", file)

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${API_BASE_URL}/process/audio`, {
    method: "POST",
    headers,
    body: formData,
  }
  )

  if (!res.ok) {
    throw new Error("Failed to upload audio file")
  }
  return res.json()
}

export async function uploadText(file: File) {
  const token = localStorage.getItem("access_token");
  const formData = new FormData()
  formData.append("file", file)

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${API_BASE_URL}/process/text`, {
    method: "POST",
    headers,
    body: formData,
  }
  )

  if (!res.ok) {
    throw new Error("Failed to upload text file")
  }
  return res.json()
}


export async function fetchOverviewStats() {
  const res = await fetch(
    `${API_BASE_URL}/records/stats/overview`,
    {
      headers: getAuthHeaders(),
    }
  );

  await handleResponse(res);

  if (!res.ok) {
    throw new Error("Failed to fetch overview stats");
  }

  return res.json();
}

export async function fetchPendingActionItems() {
  const res = await fetch(
    `${API_BASE_URL}/records/action-items/pending`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch action items");
  }

  return res.json();
}

export async function fetchActiveBlockers() {
  const res = await fetch(
    `${API_BASE_URL}/records/blockers/active`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blockers");
  }

  return res.json();
}

// Authentication APIs
export async function signup(name: string, email: string, password: string) {
  const res = await fetch(
    `${API_BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Signup failed" }));
    throw new Error(error.detail || "Signup failed");
  }

  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(
    `${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Invalid credentials" }));
    throw new Error(error.detail || "Login failed");
  }

  return res.json();
}

export async function deleteMeeting(id: number) {
  const res = await fetch(
    `${API_BASE_URL}/records/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete meeting");
  }
  return res.json();
}

export async function exportMeetingPDF(id: string) {
  const res = await fetch(
    `${API_BASE_URL}/records/${id}/export`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to export meeting");
  }
  return res.blob();
}

export async function googleAuth(token: string) {
  const res = await fetch(
    `${API_BASE_URL}/auth/oauth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  }
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Google authentication failed" }));
    throw new Error(error.detail || "Google authentication failed");
  }
  return res.json();
}
