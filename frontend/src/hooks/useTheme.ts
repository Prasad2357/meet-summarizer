import { useEffect } from 'react';

export function useTheme() {
    const applyTheme = () => {
        const root = document.documentElement;
        // Always apply light theme
        root.classList.remove('dark');
        root.classList.add('light');
    };

    useEffect(() => {
        applyTheme();
    }, []);

    return { applyTheme };
}
