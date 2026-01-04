const API_BASE_URL = "http://127.0.0.1:8000"


export async function fetchMeetings(limit = 50, skip = 0) {
    const res = await fetch(
        `${API_BASE_URL}/summarize/?limit=${limit}&skip=${skip}`
    )

if (!res.ok) {
    throw new Error("Failed to fetch meetings")
}
    return res.json()
}


export async function fetchMeetingById(id:string) {
    const res = await fetch(
        `${API_BASE_URL}/summarize/${id}/`
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