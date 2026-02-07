import { useState } from 'react';
import { useAuthStore } from '../state/authStore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import './SettingsPage.css';

export default function SettingsPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { applyTheme } = useTheme();

    // User preferences state (stored in localStorage)
    const [emailNotifications, setEmailNotifications] = useState(
        localStorage.getItem('emailNotifications') === 'true'
    );
    const [defaultMeetingType, setDefaultMeetingType] = useState(
        localStorage.getItem('defaultMeetingType') || 'general'
    );
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );
    const [autoDeleteDays, setAutoDeleteDays] = useState(
        localStorage.getItem('autoDeleteDays') || '90'
    );

    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'data'>('account');

    const handleSavePreferences = () => {
        // Save to localStorage
        localStorage.setItem('emailNotifications', emailNotifications.toString());
        localStorage.setItem('defaultMeetingType', defaultMeetingType);
        localStorage.setItem('theme', theme);
        localStorage.setItem('autoDeleteDays', autoDeleteDays);

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your meeting data will be permanently deleted.')) {
            // TODO: Implement account deletion API call
            alert('Account deletion would be implemented here');
        }
    };

    return (
        <div className="settings-page" style={{
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '0.5rem'
                }}>
                    Settings
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#64748b'
                }}>
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#15803d'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Settings saved successfully!
                </div>
            )}

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                borderBottom: '2px solid #e2e8f0',
                marginBottom: '2rem'
            }}>
                {[
                    { id: 'account', label: 'Account', icon: '👤' },
                    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
                    { id: 'data', label: 'Data & Privacy', icon: '🔒' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                            color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Account Tab */}
            {activeTab === 'account' && (
                <div className="settings-section">
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '2rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '1.5rem'
                        }}>
                            Account Information
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Name */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#475569',
                                    marginBottom: '0.5rem'
                                }}>
                                    Name
                                </label>
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    color: '#0f172a'
                                }}>
                                    {user?.name || 'N/A'}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#475569',
                                    marginBottom: '0.5rem'
                                }}>
                                    Email
                                </label>
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    color: '#0f172a'
                                }}>
                                    {user?.email || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            marginRight: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
                <div className="settings-section">
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '2rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '1.5rem'
                        }}>
                            Preferences
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Email Notifications */}
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: '#0f172a',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Email Notifications
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: '#64748b'
                                        }}>
                                            Receive emails when meetings are processed
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications}
                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </label>
                            </div>

                            {/* Default Meeting Type */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '0.5rem'
                                }}>
                                    Default Meeting Type
                                </label>
                                <select
                                    value={defaultMeetingType}
                                    onChange={(e) => setDefaultMeetingType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.975rem',
                                        color: '#0f172a',
                                        cursor: 'pointer',
                                        background: 'white'
                                    }}
                                >
                                    <option value="general">General</option>
                                    <option value="standup">Standup</option>
                                    <option value="planning">Planning</option>
                                    <option value="retro">Retrospective</option>
                                    <option value="client_call">Client Call</option>
                                </select>
                            </div>

                            {/* Theme */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '0.5rem'
                                }}>
                                    Theme
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {['light', 'dark', 'auto'].map((themeOption) => (
                                        <button
                                            key={themeOption}
                                            onClick={() => {
                                                setTheme(themeOption);
                                                applyTheme(themeOption as 'light' | 'dark' | 'auto');
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: theme === themeOption ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                background: theme === themeOption ? '#eff6ff' : 'white',
                                                color: theme === themeOption ? '#3b82f6' : '#64748b',
                                                fontSize: '0.975rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {themeOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Auto Delete */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '0.5rem'
                                }}>
                                    Auto-delete old meetings
                                </label>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    marginBottom: '0.75rem'
                                }}>
                                    Automatically delete meetings older than the selected period
                                </p>
                                <select
                                    value={autoDeleteDays}
                                    onChange={(e) => setAutoDeleteDays(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.975rem',
                                        color: '#0f172a',
                                        cursor: 'pointer',
                                        background: 'white'
                                    }}
                                >
                                    <option value="never">Never</option>
                                    <option value="30">30 days</option>
                                    <option value="60">60 days</option>
                                    <option value="90">90 days</option>
                                    <option value="180">180 days</option>
                                    <option value="365">1 year</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSavePreferences}
                            style={{
                                marginTop: '2rem',
                                padding: '0.75rem 2rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#2563eb';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#3b82f6';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
                <div className="settings-section">
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '2rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '1.5rem'
                        }}>
                            Data Management
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Export Data */}
                            <div style={{
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '0.5rem'
                                }}>
                                    📥 Export Your Data
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    marginBottom: '1rem'
                                }}>
                                    Download all your meeting transcripts and summaries
                                </p>
                                <button
                                    onClick={() => alert('Export functionality would be implemented here')}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Export Data
                                </button>
                            </div>

                            {/* Clear Cache */}
                            <div style={{
                                padding: '1.5rem',
                                background: '#fff7ed',
                                borderRadius: '8px',
                                border: '1px solid #fed7aa'
                            }}>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '0.5rem'
                                }}>
                                    🗑️ Clear Cache
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    marginBottom: '1rem'
                                }}>
                                    Clear local cache and temporary files
                                </p>
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        alert('Cache cleared successfully');
                                    }}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        background: '#ea580c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Clear Cache
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '2px solid #fee2e2',
                        padding: '2rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#dc2626',
                            marginBottom: '1.5rem'
                        }}>
                            ⚠️ Danger Zone
                        </h2>

                        <div style={{
                            padding: '1.5rem',
                            background: '#fef2f2',
                            borderRadius: '8px',
                            border: '1px solid #fecaca'
                        }}>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#0f172a',
                                marginBottom: '0.5rem'
                            }}>
                                Delete Account
                            </h3>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginBottom: '1rem'
                            }}>
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
