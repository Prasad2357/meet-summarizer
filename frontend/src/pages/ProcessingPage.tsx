import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProcessingStep from "@/components/processing/ProcessingStep"
import waveform from "@/assets/waveform_image.png"
import brain from "@/assets/LLM_image.png"
import { useProcessingStore } from "../state/processingStore"
import { use } from "react"




export default function ProcessingPage() {

    const {meetingId, isProcessing} = useProcessingStore()
    const navigate = useNavigate()
    const [progress, setProgress] = useState(10)


    useEffect(() => {
        if (!isProcessing && meetingId) {
            navigate(`/meetings/${meetingId}`)
        }
    }, [isProcessing, meetingId])


    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((p) => Math.min(p + 5 ,10))
        }, 500)
        return () => clearInterval(timer)
    }, [])


  return (

        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="w-full max-w-3xl space-y-10">
                
        <ProcessingStep
          title="Transcribing Audio"
          subtitle="Whisper model active"
          progress={65}
          image={waveform}
        />

        <ProcessingStep
          title="Summarizing Insights"
          subtitle="LLM active"
          progress={30}
          image={brain}
        />

            </div>
        </div>

  )
}