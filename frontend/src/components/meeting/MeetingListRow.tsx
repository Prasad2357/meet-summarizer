import './MeetingListRow.css';

type MeetingListRowProps = {
    id: number
    title: string
    date: string
    category: string
    summary: string
    status?: string
    progress?: number
    onDelete?: (id: number) => void
}

export default function MeetingListRow({
    id,
    title,
    date,
    category,
    summary,
    status = "DONE",
    progress = 100,
    onDelete,
}: MeetingListRowProps) {
    const isProcessing = status === "PENDING" || status === "PROCESSING"
    const isFailed = status === "FAILED"

    // Truncate summary to ~50 characters
    const truncatedSummary = summary.length > 50
        ? summary.substring(0, 50) + '...'
        : summary

    return (
        <div className={`meeting-list-row ${isProcessing ? 'processing' : ''} ${isFailed ? 'failed' : ''}`}>
            {/* Title Column */}
            <div className="list-row-title">
                <h3>{title}</h3>
            </div>

            {/* Date Column */}
            <div className="list-row-date">
                <span>📅 {date}</span>
            </div>

            {/* Category Column */}
            <div className="list-row-category">
                {isProcessing ? (
                    <span className="badge badge-processing">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="spinner">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                        Processing {progress}%
                    </span>
                ) : isFailed ? (
                    <span className="badge badge-failed">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        Failed
                    </span>
                ) : (
                    <span className="badge badge-category">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {category}
                    </span>
                )}
            </div>

            {/* Summary Column */}
            <div className="list-row-summary">
                <p>
                    {isProcessing
                        ? "Analyzing meeting..."
                        : truncatedSummary}
                </p>
            </div>

            {/* Delete Column */}
            {onDelete && (
                <div className="list-row-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this meeting?')) {
                                onDelete(id);
                            }
                        }}
                        style={{
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
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
                </div>
            )}
        </div>
    )
}
