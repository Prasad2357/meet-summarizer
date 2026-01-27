import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { uploadAudio, uploadText } from "../../lib/api"
import type { MeetingListItem } from "../../types/meeting"
import type { UploadResponse } from "../../types/meeting";  // Add this import

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: (meeting: UploadResponse) => void;  // Change the type here
}

type AnalysisType = "audio" | "text"

export default function NewAnalysisModal({ open, onClose, onCreated }: Props) {
    const [mode, setMode] = useState<"audio" | "text">("audio")
    // const [type, setType] = useState<AnalysisType>("audio")
    const [file, setFile] = useState<File | null>(null)
    // const [precision, setPrecision] = useState<"fast" | "high">("fast")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)


    async function handleSubmit() {
        if (!file) return

        setSubmitting(true)
        setError(null)

        try {
            const result = mode === "audio"
                ? await uploadAudio(file)
                : await uploadText(file)

            console.log("Upload result:", result);
            onCreated(result)
            onClose()
        }
        catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "Failed to upload file.")
        }
        finally {
            setSubmitting(false)
        }

    }


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>New Analysis</DialogTitle>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex rounded-lg bg-muted p-1">
                    <button
                        onClick={() => setMode("audio")}
                        className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "audio" ? "bg-background shadow" : ""
                            }`}
                    >
                        Audio File
                    </button>

                    <button
                        onClick={() => setMode("text")}
                        className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "text" ? "bg-background shadow" : ""
                            }`}
                    >
                        Text Transcript
                    </button>
                </div>


                <input
                    type="file"
                    accept={mode === "audio" ? ".mp3,.wav" : ".txt,.md"}
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0]
                        if (selectedFile) {
                            setFile(selectedFile)
                        }
                    }}
                />

                {/* Body */}
                <label
                    htmlFor="file-upload"
                    className="mt-6 block cursor-pointer border border-dashed rounded-lg p-8 text-center text-muted-foreground hover:border-primary transition"
                >

                    {file ? (
                        <p className="text-medium text-foreground"> {file.name}</p>
                    ) : (
                        <p>
                            {mode === "audio"
                                ? "Click to upload an audio file (MP3, WAV)"
                                : "Click to upload a text transcript (TXT, MD, JSON)"}
                        </p>
                    )}
                </label>

                {/* Action */}
                {error && (
                    <p className="text-sm text-red-500 text-center mt-4">
                        {error}
                    </p>
                )}

                <Button className="mt-6 w-full" disabled={!file || submitting} onClick={handleSubmit}>
                    {submitting ? "Processing..." :
                        mode === "audio"
                            ? "Start Transcription & Summary"
                            : "Start Summary"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}