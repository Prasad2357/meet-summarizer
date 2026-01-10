const API_BASE_URL = "http://127.0.0.1:8000"

export async function fetchMeetings(limit = 50, skip = 0) {
    const res = await fetch(
        `${API_BASE_URL}/records/?limit=${limit}&skip=${skip}`
    )

if (!res.ok) {
    throw new Error("Failed to fetch meetings")
}
    return res.json()
}


export async function fetchMeetingById(id:string) {
    const res = await fetch(
        `${API_BASE_URL}/records/${id}/`
    )

    if (!res.ok) {
        throw new Error("Failed to fetch meeting")
    }
    return res.json()
}

export async function uploadAudio(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(
        `${API_BASE_URL}/process/audio`, {
            method: "POST",
            body: formData,
        }
    )

    if (!res.ok) {
        throw new Error("Failed to upload audio file")
    }
    return res.json()
}

export async function uploadText(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(
        `${API_BASE_URL}/process/text`, {
            method: "POST",
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
    `${API_BASE_URL}/records/stats/overview`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch overview stats");
  }

  return res.json();
}

export async function fetchPendingActionItems() {
  const res = await fetch(
    `${API_BASE_URL}/records/action-items/pending`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch action items");
  }

  return res.json();
}

export async function fetchActiveBlockers() {
  const res = await fetch(
    `${API_BASE_URL}/records/blockers/active`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blockers");
  }

  return res.json();
}
