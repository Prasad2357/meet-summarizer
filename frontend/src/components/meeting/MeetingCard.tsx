import './MeetingCard.css';

type MeetingCardProps = {
  title: string
  date: string
  tags: string[]
  summary: string
  status?: string
  progress?: number
}

export default function MeetingCard({
  title,
  date,
  tags,
  summary,
  status = "DONE",
  progress = 100,
}: MeetingCardProps) {
  const isProcessing = status === "PENDING" || status === "PROCESSING"
  const isFailed = status === "FAILED"

  // Calculate progress for the border animation (0-100)
  const progressPercentage = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="meeting-card-wrapper">
      <div
        className={`meeting-card ${isProcessing ? 'processing' : ''} ${isFailed ? 'failed' : ''}`}
        style={{
          ['--progress' as any]: `${progressPercentage}%`
        }}
      >
        <div className="meeting-card-content">
          {/* Title */}
          <h3 className="text-lg font-semibold" style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            marginBottom: '0.375rem',
            color: isProcessing ? '#475569' : '#0f172a',
            transition: 'color 0.3s ease'
          }}>
            {title}
          </h3>

          {/* Date */}
          <p className="text-sm text-muted-foreground" style={{
            fontSize: '0.875rem',
            color: '#64748b',
            marginBottom: '0.875rem',
            fontWeight: 500
          }}>
            📅 {date}
          </p>

          {/* Status Badge */}
          <div className="mt-2 flex gap-2 flex-wrap" style={{ marginBottom: '1rem' }}>
            {isProcessing && (
              <span className="badge badge-processing">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                Processing {progressPercentage}%
              </span>
            )}
            {isFailed && (
              <span className="badge badge-failed">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Failed
              </span>
            )}
            {!isProcessing && !isFailed && tags.map((tag) => (
              <span
                key={tag}
                className="badge badge-normal"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {tag}
              </span>
            ))}
          </div>

          {/* Summary text */}
          <p
            className={`text-sm ${isProcessing ? 'processing-summary' : ''}`}
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: isProcessing ? '#64748b' : '#334155',
              fontWeight: 400
            }}
          >
            {isProcessing
              ? 'Your meeting is being analyzed. We\'re extracting key insights, action items, and decisions...'
              : summary}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
