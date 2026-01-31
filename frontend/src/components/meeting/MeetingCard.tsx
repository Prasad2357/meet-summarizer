import './MeetingCard.css';

type MeetingCardProps = {
  id: number
  title: string
  date: string
  tags: string[]
  summary: string
  status?: string
  progress?: number
  onDelete?: (id: number) => void
}

export default function MeetingCard({
  id,
  title,
  date,
  tags,
  summary,
  status = "DONE",
  progress = 100,
  onDelete,
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
          ['--progress' as any]: `${progressPercentage}%`,
          position: 'relative'
        }}
      >
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this meeting?')) {
                onDelete(id);
              }
            }}
            className="delete-button"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 10,
              opacity: 0.8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Delete meeting"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg>
          </button>
        )}

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
