import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useLogoutMutation } from '../slices/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/userSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Menu, Dropdown, Spin } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
  ToolOutlined,
  CommentOutlined,
  ProductOutlined,
} from '@ant-design/icons';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import '../Header.css';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoutApi] = useLogoutMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { userInfo } = useSelector(state => state.user);
    const { data: categories, isLoading: loadingCategories, error } = useGetCategoriesQuery();
    
    // State to store search keyword
    const [keyword, setKeyword] = useState('');

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            navigate("/login");
            dispatch(logout()); // Clear user info from Redux state
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    useEffect(() => {
        const elementsToToggle = [
            '.content-wrapper',
            '.content-table',
            '.content-menu',
            '.footer-wrapper',
            '.main-header'
        ];
        
        elementsToToggle.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                if (isSidebarOpen) {
                    element.classList.remove('sidebar-closed');
                } else {
                    element.classList.add('sidebar-closed');
                }
            }
        });
    }, [isSidebarOpen]);

    const accountMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    const categoriesMenu = (
        <Menu>
            <Menu.Item key="all-products">
                <Link to="/">All Products</Link>
            </Menu.Item>
            {loadingCategories ? (
                <Menu.Item key="loading">
                    <Spin size="small" /> Loading Categories...
                </Menu.Item>
            ) : error ? (
                <Menu.Item key="error">
                    Error loading categories
                </Menu.Item>
            ) : (
                categories.map(category => (
                    <Menu.Item key={category._id}>
                        <Link to={`/category/${category._id}`}>
                            {category.name}
                        </Link>
                    </Menu.Item>
                ))
            )}
        </Menu>
    );

    return (
        <>
            <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" onClick={toggleSidebar}>
                        {isSidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    </a>
                </li>

                    <div className="flex items-center justify-between ml-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        className="ml-4 p-2 rounded-md bg-white-700 text-back hidden sm:block"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                    <button 
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hidden sm:block ml-2"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                </ul>
                
                <ul className="navbar-nav ml-auto">
                    {userInfo && (
                        <>
                            <li className="nav-item">
                                <Dropdown overlay={categoriesMenu} trigger={['click']}>
                                    <a className="nav-link" onClick={e => e.preventDefault()}>
                                        <ProductOutlined /> Category
                                    </a>
                                </Dropdown>
                            </li>

                            <li className="nav-item">
                                <Dropdown overlay={accountMenu} trigger={['click']}>
                                    <a className="nav-link" onClick={e => e.preventDefault()}>
                                        <UserOutlined /> {userInfo.name}
                                    </a>
                                </Dropdown>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {/* Sidebar menu */}
            <div className="menu">
                <Menu 
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={!isSidebarOpen}
                >
                    <Link to="/" className="brand-link">
    <img src="/images/icon.png" alt="Admin Logo" className="brand-image img-circle mr-2" />
    <span className={`brand-text text-white ${isSidebarOpen ? '' : 'hide'}`}>SE LAB MFU</span>
</Link>
                    {userInfo && userInfo.isAdmin && (
                        <Menu.SubMenu key="sub2" icon={<AppstoreOutlined />} title="Admin">
                            <Menu.SubMenu key="sub3" icon={<ToolOutlined />} title="Management"> 
                                <Menu.Item key="9"><Link to="/admin/users">Users lists</Link></Menu.Item>
                                <Menu.Item key="10"><Link to="/admin/products">Products lists</Link></Menu.Item>
                            </Menu.SubMenu>
                            <Menu.SubMenu key="sub4" icon={<UnorderedListOutlined />} title="Request lists"> 
                                <Menu.Item key="11"><Link to="/admin/orders">Pending</Link></Menu.Item>
                                <Menu.Item key="12"><Link to="/admin/confirm">Confirm</Link></Menu.Item>
                                <Menu.Item key="15"><Link to="/admin/borrowing">Borrowing</Link></Menu.Item>
                                <Menu.Item key="13"><Link to="/admin/return">Return</Link></Menu.Item>
                                <Menu.Item key="14"><Link to="/admin/cancel">Cancel</Link></Menu.Item>
                                <Menu.Item key="16"><Link to="/admin/non">Non-returnable</Link></Menu.Item>
                            </Menu.SubMenu>
                            <Menu.Item key="6" icon={<MailOutlined />}>
                                <Link to="/admin/manageMessages"> Messages </Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                    )}
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/">
                            Home
                        </Link>
                    </Menu.Item>
                    
                    {userInfo && (
                        <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
                            <Link to="/cart">
                                Cart
                            </Link>
                        </Menu.Item>
                    )}
                    {userInfo && (
                        <Menu.Item key="5" icon={<UserOutlined />}>
                            <Link to="/profile2">
                                My Borrowing
                            </Link>
                        </Menu.Item>
                    )}
                    {userInfo && (
                        <Menu.Item key="7" icon={<CommentOutlined />}>
                            <Link to="/contactUs" className="text-white flex items-center">
                                Contact
                            </Link>
                        </Menu.Item>
                    )}
                    {!userInfo && (
                        <Menu.Item key="3" icon={<LoginOutlined />}>
                            <Link to="/login">
                                Sign in
                            </Link>
                        </Menu.Item>
                    )}
                </Menu>
            </div>
        </>
    );
}

export default Header;