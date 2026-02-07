import { useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
    const applyTheme = (theme: Theme) => {
        const root = document.documentElement;

        // Remove existing theme classes
        root.classList.remove('light', 'dark');

        if (theme === 'auto') {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.add('light');
            }
        } else {
            root.classList.add(theme);
        }

        // Save to localStorage
        localStorage.setItem('theme', theme);
    };

    const initializeTheme = () => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
        applyTheme(savedTheme);
    };

    useEffect(() => {
        initializeTheme();

        // Listen for system theme changes when in auto mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const currentTheme = localStorage.getItem('theme') as Theme;
            if (currentTheme === 'auto') {
                applyTheme('auto');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return { applyTheme };
}
