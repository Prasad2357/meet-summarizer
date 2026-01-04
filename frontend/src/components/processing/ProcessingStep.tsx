

type ProcessingStepProps = {
    title: string
    subtitle: string
    progress: number
    image?: string
}

export default function ProcessingStep({ title, subtitle, progress, image }: ProcessingStepProps) {
    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">

                {image && (
                    < img src={image} alt={title} className="h-24 w-24 object-contain" />
                )}

                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground text-center">{subtitle}</p>

                <div className="w-full bg-muted rounded-full h-4 mt-4">
                    <div
                        className="bg-primary h-4 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}