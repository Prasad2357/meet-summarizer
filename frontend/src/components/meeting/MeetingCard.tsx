type MeetingCardProps = {
    
  title: string
  date: string
  tags: string[]
  summary: string
}


export default function MeetingCard(
    {
        title,
        date,
        tags,
        summary,
    }: MeetingCardProps) {
  return (
    <div className="rounded-xl border p-4 bg-background hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{title}</h3>

       <p className="text-sm text-muted-foreground">{date}</p>

      <div className="mt-2 flex gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs rounded-full bg-muted px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {summary}
      </p>
    </div>

  )
}
