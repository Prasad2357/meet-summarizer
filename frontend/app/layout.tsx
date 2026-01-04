import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function Layout ({children}) {
    return (
        <div>
            <TopBar />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main>{children}</main>
            </div>
        </div>
    )
}