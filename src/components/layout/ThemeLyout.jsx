import { useEffect, useRef, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
    SunOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Header, Sider, Content } = Layout;
const DashboardLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const [darkMode, setDarkMode] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Ref for dropdown click outside detection
    const userMenuRef = useRef(null);

    // Sync Tailwind's dark mode class to document root
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // Close user menu on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        }

        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuOpen]);

    // Example user info
    const user = {
        name: "User Name",
        email: "user@example.com",
    };

    // Get user initial for avatar circle
    const userInitial = user.name.charAt(0).toUpperCase();


    const items = [
        {
            key: '2',
            label: (
                <a
                    href="#profile"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 h-fit"
                    onClick={() => setUserMenuOpen(false)}
                >
                    Profile
                </a>
            ),
        },
        {
            key: '4',
            label: (
                <a
                    href="#settings"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700  h-fit"
                    onClick={() => setUserMenuOpen(false)}
                >
                    Settings
                </a>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '5',
            label: (
                <a
                    href="#logout"
                    className="block px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700 dark:text-red-400"
                    onClick={() => {
                        setUserMenuOpen(false);
                        window.location.href = "/";
                    }}
                >
                    Logout
                </a>
            ),
        },
    ];
    return (
        <Layout className='h-screen'>
            <Sider trigger={null} collapsible collapsed={collapsed}

                className={`
          ${!collapsed ? "w-64" : "w-16"} 
          bg-white dark:bg-gray-800 
          transition-width duration-300 
          flex flex-col
          shadow-lg`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {!collapsed ? "My Dashboard" : "MD"}
                    </span>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                    {[
                        { name: "Home", icon: "🏠", path: "/home" },
                        { name: "Profile", icon: "👤", path: "/profile" },
                        { name: "Settings", icon: "⚙️", path: "/settings" },
                        { name: "Reports", icon: "📊", path: "/reports" },
                        { name: "Logout", icon: "🚪", path: "/" },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${collapsed ? "justify-center" : ""
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!collapsed && <span className='text-gray-800 dark:text-gray-100'>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700"></div>
            </Sider>
            <Layout>
                <Header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="flex items-center justify-center p-0 w-10 h-10 text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded"
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        />
                        <h1 className="text-xl font-semibold hidden sm:block text-gray-900 dark:text-gray-100 select-none">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Dark/Light toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors text-lg flex items-center justify-center"
                            title={darkMode ? "Light Mode" : "Dark Mode"}
                        >
                            {darkMode ? (
                                <SunOutlined style={{ color: "#facc15", fontSize: 22 }} />
                            ) : (
                                <MoonOutlined style={{ color: "#4b5563", fontSize: 22 }} />
                            )}
                        </button>

                        <Dropdown menu={{ items }} trigger={['click']}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                                aria-haspopup="true"
                                aria-expanded={userMenuOpen}
                                aria-label="User menu"
                                type="button"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold select-none">
                                    {userInitial}
                                </div>
                                <span className="hidden sm:inline text-gray-800 dark:text-gray-100 font-medium select-none">
                                    {user.name}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>
                        </Dropdown>

                    </div>
                </Header>

                <Content
                    className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900"

                >
                    {children ? (
                        children
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p>Your dashboard content goes here.</p>
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};
export default DashboardLayout;