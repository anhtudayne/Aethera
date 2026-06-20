import React from 'react';
import '../admin.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_15%_50%,rgba(99,102,241,0.05),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(139,92,246,0.05),transparent_25%)] bg-fixed">
            {/* SideNavBar */}
            <nav className="h-screen w-64 fixed left-0 top-0 bg-surface/60 backdrop-blur-xl border-r border-white/10 shadow-sm transition-all duration-200 ease-in-out flex flex-col py-6 px-4 z-50 hidden md:flex">
                {/* Brand */}
                <div className="mb-8 flex items-center gap-3 px-2">
                    <div className="h-10 w-10 rounded-lg bg-primary-container/20 flex items-center justify-center border border-primary/20 shrink-0">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>widgets</span>
                    </div>
                    <div>
                        <h1 className="font-headline-md text-headline-md font-bold text-on-surface leading-tight">SaaS Admin</h1>
                        <p className="font-label-caps text-label-caps text-on-surface-variant/70">Enterprise Suite</p>
                    </div>
                </div>
                {/* Nav Links */}
                <div className="flex-1 space-y-1">
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-bold border-r-2 border-primary bg-primary/5 transition-colors" href="/admin/dashboard">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-body-sm hover:bg-white/5 hover:text-on-surface transition-colors" href="#">
                        <span className="material-symbols-outlined">group</span>
                        <span>Users</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-body-sm hover:bg-white/5 hover:text-on-surface transition-colors" href="#">
                        <span className="material-symbols-outlined">school</span>
                        <span>Courses</span>
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant font-body-sm hover:bg-white/5 hover:text-on-surface transition-colors" href="#">
                        <span className="material-symbols-outlined">payments</span>
                        <span>Payouts</span>
                    </a>
                </div>
            </nav>

            {/* TopNavBar */}
            <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 bg-surface/60 backdrop-blur-xl border-b border-white/5 shadow-sm flex items-center justify-between px-4 md:px-8 z-40 transition-all duration-200">
                <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-2 -ml-2 rounded-lg">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="flex-1 flex items-center">
                    <div className="relative w-full max-w-md group hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
                        <input className="w-full bg-[#020617] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-on-surface font-body-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search..." type="text"/>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 pl-4">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5 relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
                    <button className="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent focus:ring-primary/20 transition-all">
                        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">A</div>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-[calc(4rem+1.5rem)] px-4 md:px-8 pb-12 w-full md:pl-[calc(16rem+2rem)] min-h-screen transition-all duration-200">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
