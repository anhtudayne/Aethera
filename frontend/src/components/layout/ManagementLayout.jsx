import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const ManagementLayout = ({ children, role: propRole = 'user' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get user from Redux store for real-time synchronization
    const { user: reduxUser } = useSelector((state) => state.auth);
    const userData = reduxUser || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

    const role = userData?.role || propRole;
    const userImage = userData?.image || userData?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAKpzZNaITytRFyq1U1RoCLoxYekbNpl3Vsk7g9Z2sRFOFcJ98xaaDBTB64JW4mAs0RLLfEQc68WhjYbpjT0ZtVYq75aQ9_dOGqwsIt_BqUXw9lOOUVokgvVJ-eWJutsrjfjhjOOGox4qTbYbHjJyTZEIZ00HIxJ_21wHhLlRyfbmWZctVz_fL_JXUxhX_THS74cjDy9CefBz3GgpAyx3EyXaduBci-8a7HnNKQhH5OKxRKEpWOAf2nk5GC_3OEhDHwtTAdiiEFTA";
    const userName = userData ? `${userData.firstName} ${userData.lastName}` : (role === 'admin' ? 'System Admin' : 'User');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Helper to generate breadcrumb based on current path
    const getBreadcrumb = () => {
        if (location.pathname.includes('/profile')) return 'Edit Profile';
        if (location.pathname === '/') return 'Overview';
        if (location.pathname.includes('/users')) return 'Users';
        return 'Dashboard';
    };

    return (
        <div className="bg-surface min-h-screen font-body-sm text-on-surface antialiased">
            {/* TopAppBar */}
            <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm w-full sticky top-0 z-50">
                <div className="container mx-auto max-w-container-max px-4 flex justify-between items-center h-16">
                    {/* Left: Logo & Breadcrumbs Grouped */}
                    <div className="flex items-center gap-6">
                        <span className="font-display-lg text-display-lg text-primary font-bold">
                            {role === 'admin' ? 'UserAdmin' : 'UserPortal'}
                        </span>

                        {/* Breadcrumbs - Thay thế cho Nav Menu cũ */}
                        <div className="hidden md:flex items-center text-on-surface-variant text-sm font-medium">
                            <span className="opacity-60">Management</span>
                            <span className="material-symbols-outlined mx-1 text-[18px] opacity-60">chevron_right</span>
                            <span className="text-primary">{getBreadcrumb()}</span>
                        </div>
                    </div>

                    {/* Right: Utilities */}
                    <div className="flex items-center gap-x-4">
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low active:opacity-70 flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low active:opacity-70 flex items-center justify-center">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                        <Link to={`/${role}/profile`} className="w-9 h-9 rounded-full overflow-hidden border-2 border-outline-variant cursor-pointer hover:border-primary transition-colors">
                            <img alt="User profile" className="w-full h-full object-cover" src={userImage} />
                        </Link>
                        {/* Logout button in Header - vital for mobile and very convenient for desktop */}
                        <button 
                            onClick={handleLogout} 
                            className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-surface-container-low active:opacity-70 flex items-center justify-center"
                            title="Đăng xuất"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="container mx-auto max-w-container-max px-4 flex">
                {/* SideNavBar */}
                <aside className="hidden md:flex flex-col gap-2 p-4 w-64 bg-surface-container-low h-[calc(100vh-64px)] sticky top-16 border-r border-outline-variant">
                    <div className="mb-4 pb-4 border-b border-outline-variant flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container">
                            <img src={userImage} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="font-title-sm text-title-sm font-bold text-on-surface truncate max-w-[140px]">{userName}</h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">{role === 'admin' ? 'System Admin' : 'User'}</p>
                        </div>
                    </div>
                    <nav className="flex-1 flex flex-col gap-1">
                        <Link to={`/${role}/profile`} className={`flex items-center gap-4 px-4 py-2 font-label-caps text-label-caps rounded-xl transition-all scale-95 active:scale-90 duration-150 ${location.pathname.includes('/profile') ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                            <span className="material-symbols-outlined">person</span>
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-2 font-label-caps text-label-caps text-error hover:bg-error-container transition-all scale-95 active:scale-90 duration-150 rounded-lg">
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </button>
                    </nav>
                </aside>

                {/* Main Content Canvas */}
                <main className="flex-1 p-6 max-w-4xl">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ManagementLayout;
