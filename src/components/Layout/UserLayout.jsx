import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import OrderSeatPage from "../page/OrderSeatsView/OrderSeatPage.jsx";
import OrderHistoryPage from "../page/OrderHistory/OrderHistoryPage.jsx";
import Convention from "../page/NoticeAndConvention/Convention.jsx";
import NoticePage from "../page/NoticeAndConvention/NoticePage.jsx";
import NewReportPage from "../page/Report/NewReportPage.jsx";
import ReportHistoryPage from "../page/Report/ReportHistoryPage.jsx";
import UserInfoPage from "../page/UserInfo/UserInfoPage.jsx";
const { Header, Sider, Content } = Layout;

const Pages = {
    "OrderSeatPage" : <OrderSeatPage/>,
    "OrderSeatHistory" : <OrderHistoryPage/>,
    "ConventionPage":<Convention/>,
    "NoticePage":<NoticePage/>,
    "NewReportPage":<NewReportPage/>,
    "ReportHistoryPage":<ReportHistoryPage/>,
    "UserInfoPage":<UserInfoPage/>
}
const UserLayout = () => {
    const [currentPage, setCurrentPage] = useState("OrderSeatPage");
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{height: "100vh"}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1-1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: '座位预约中心',
                            children: [
                                {
                                    key: '1-1',
                                    icon: <UserOutlined />,
                                    label: '座位预约',
                                    onClick: () => {
                                        setCurrentPage("OrderSeatPage");
                                    }
                                },
                                {
                                    key: '1-2',
                                    icon: <UserOutlined />,
                                    label: '个人预约记录',
                                    onClick: () => {
                                        setCurrentPage("OrderSeatHistory");
                                    }
                                }
                            ]

                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: '信息中心',
                            children: [
                                {
                                    key: '2-1',
                                    icon: <UserOutlined />,
                                    label: '自习室公约',
                                    onClick: () => {
                                        setCurrentPage("ConventionPage");
                                    }
                                },
                                {
                                    key: '2-2',
                                    icon: <UserOutlined />,
                                    label: '自习室通知',
                                    onClick: () => {
                                        setCurrentPage("NoticePage");
                                    }
                                }
                            ]
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: '投诉中心',
                            children:[
                                {
                                    key: '3-1',
                                    icon: <UserOutlined />,
                                    label: '意见反馈',
                                    onClick: () => {
                                        setCurrentPage("NewReportPage");
                                    }
                                },
                                {
                                    key: '3-2',
                                    icon: <UserOutlined />,
                                    label: '反馈记录',
                                    onClick: () => {
                                        setCurrentPage("ReportHistoryPage");
                                    }
                                }

                            ]
                        },
                        {
                            key: '4',
                            icon: <UploadOutlined />,
                            label: '个人中心',
                            onClick: () => {
                                setCurrentPage("UserInfoPage");
                            }
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
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
                    <span>自习室预约管理系统</span>
                </Header>
                {
                    Pages[currentPage]
                }
            </Layout>
        </Layout>
    );
};
export default UserLayout;