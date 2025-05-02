import { useState } from 'react'
import {
    AreaChartOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BellOutlined, FormOutlined, AppstoreAddOutlined, CreditCardOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, message, theme } from 'antd'
import OrderSeatPage from '../page/OrderSeatsView/OrderSeatPage.jsx'
import OrderHistoryPage from '../page/OrderHistory/OrderHistoryPage.jsx'
import Convention from '../page/NoticeAndConvention/Convention.jsx'
import NoticePage from '../page/NoticeAndConvention/NoticePage.jsx'
import NewReportPage from '../page/Report/NewReportPage.jsx'
import ReportHistoryPage from '../page/Report/ReportHistoryPage.jsx'
import UserInfoPage from '../page/UserInfo/UserInfoPage.jsx'
import AdminSeatsManage from '../page/admin/SeatManage/AdminSeatsManage.jsx'
import AdminSeatsStatus from '../page/admin/SeatManage/AdminSeatsStatus.jsx'
import UserManagePage from '../page/admin/UserManage/UserManagePage.jsx'
import AdminOrderList from '../page/admin/SeatManage/AdminOrderList.jsx'
import AdminNoticePage from '../page/admin/NoticeManage/AdminNoticePage.jsx'
import AdminSystemPage from '../page/admin/SystemManage/AdminSystemPage.jsx'
import AdminConventionPage
    from '../page/admin/ConventionManage/AdminConventionPage.jsx'
import AdminReportPage from '../page/admin/ReportManage/AdminReportPage.jsx'

const { Header, Sider } = Layout;

const Pages = {
    "OrderSeatPage" : <OrderSeatPage/>,
    "OrderSeatHistory" : <OrderHistoryPage/>,
    "ConventionPage": <Convention/>,
    "NoticePage": <NoticePage/>,
    "NewReportPage": <NewReportPage/>,
    "ReportHistoryPage": <ReportHistoryPage/>,
    "UserInfoPage": <UserInfoPage/>,
    "AdminOrderSeatPage": <AdminSeatsManage/>,
    "AdminSeatsStatusPage": <AdminSeatsStatus/>,
    "UserManagePage": <UserManagePage/>,
    "AdminOrderList": <AdminOrderList/>,
    "AdminNoticePage": <AdminNoticePage/>,
    "AdminSystemPage": <AdminSystemPage/>,
    "AdminConventionPage": <AdminConventionPage/>,
    "AdminReportPage": <AdminReportPage/>
}

const UserLayout = () => {
    const [currentPage, setCurrentPage] = useState(localStorage.getItem('role') ? 'AdminOrderSeatPage' : 'OrderSeatPage');
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login/out`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.clear();
                window.location.replace(result.redirect);
            } else {
                message.error('退出登录失败');
            }
        } catch (e) {
            console.error('退出异常:', e);
            message.error('退出登录时发生异常');
            // 异常时强制退出
            localStorage.removeItem('token');
            window.location.reload();
        }
    }
    const defaultKeys = (() => {
        const role = localStorage.getItem('role') || 'user';
        return role === 'admin' ? [ 'admin-nav-1'] : ['1-1'];
    })();
    return (
        <Layout style={{height: "100vh"}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={defaultKeys}
                    items={(() => {
                        const role = localStorage.getItem('role') || 'user'; // 添加默认值

                        // 公共菜单项
                        const baseMenu = role === "user" ? [
                            {
                                key: '1',
                                icon: <UserOutlined />,
                                label: '座位预约中心',
                                children: [
                                    {
                                        key: '1-1',
                                        label: '座位预约',
                                        onClick: () => setCurrentPage("OrderSeatPage")
                                    },
                                    {
                                        key: '1-2',
                                        label: '预约记录',
                                        onClick: () => setCurrentPage("OrderSeatHistory")
                                    }
                                ]
                            }
                        ] : [];

                        // 管理员扩展菜单
                        const adminMenu = role === 'admin' ? [
                            {
                                key: 'admin-nav-1',
                                icon: <AreaChartOutlined />,
                                label: '预约总览',
                                onClick: () => setCurrentPage("AdminOrderSeatPage")
                            },
                            {
                                key: 'admin-nav-2',
                                label: '预约记录',
                                icon: <UploadOutlined />,
                                onClick: () => setCurrentPage("AdminOrderList")
                            },
                            {
                                key: 'admin-nav-3',
                                label: '座位管理',
                                icon: <FormOutlined />,
                                onClick: () => setCurrentPage("AdminSeatsStatusPage")
                            },
                            {
                                key: 'admin-nav-4',
                                label: '用户管理',
                                icon: <UserOutlined />,
                                onClick: () => setCurrentPage("UserManagePage")
                            },
                            {
                                key: 'admin-nav-5',
                                label: '公告管理',
                                icon: <BellOutlined />,
                                onClick: () => setCurrentPage("AdminNoticePage")
                            },
                            {
                                key: 'admin-nav-7',
                                label: '公约管理',
                                icon: <CreditCardOutlined />,
                                onClick: () => setCurrentPage("AdminConventionPage")
                            },
                            {
                                key: 'admin-nav-8',
                                label: '投诉举报',
                                icon: <BellOutlined />,
                                onClick: () => setCurrentPage("AdminReportPage")
                            },
                            {
                                key: 'admin-nav-6',
                                label: '系统设置',
                                icon: <AppstoreAddOutlined />,
                                onClick: () => setCurrentPage("AdminSystemPage")
                            }
                        ] : [];

                        // 用户专属菜单
                        const userMenu = role === 'user' ? [
                            {
                                key: '2',
                                icon: <VideoCameraOutlined />,
                                label: '信息中心',
                                children: [
                                    { key: '2-1', label: '自习室公约', onClick: () => setCurrentPage("ConventionPage") },
                                    { key: '2-2', label: '通知公告', onClick: () => setCurrentPage("NoticePage") }
                                ]
                            },
                            {
                                key: '3',
                                icon: <UploadOutlined />,
                                label: '投诉中心',
                                children: [
                                    { key: '3-1', label: '意见反馈', onClick: () => setCurrentPage("NewReportPage") },
                                    { key: '3-2', label: '反馈记录', onClick: () => setCurrentPage("ReportHistoryPage") }
                                ]
                            }
                        ] : [];

                        return [
                            ...baseMenu,
                            ...adminMenu,
                            ...userMenu,
                            {
                                key: '4',
                                icon: <UploadOutlined />,
                                label: '个人中心',
                                onClick: () => setCurrentPage("UserInfoPage")
                            }
                        ];
                    })()}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between', // 添加两端对齐
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <span style={{ marginLeft: 8 }}>自习室预约管理系统</span>
                    </div>

                    <Button
                        icon={<LogoutOutlined />}
                        type="text"
                        danger
                        style={{
                            marginRight: 24,
                            height: 40,
                            // 新增对齐样式
                            alignSelf: 'center',
                            marginLeft: 'auto',
                            width: 'fit-content'
                        }}
                        onClick={handleLogout}
                    >
                        退出
                    </Button>
                </Header>
                {
                    Pages[currentPage]
                }
            </Layout>
        </Layout>
    );
};
export default UserLayout;