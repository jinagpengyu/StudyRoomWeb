import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import Login from './components/ui/login.jsx';
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes'
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/ui/register.jsx";
import UserIndex from "./components/page/UserInfo/UserIndex.jsx";
import OrderHistory from "./components/page/OrderHistory/OrderHistory.jsx";
import PleaseLogin from "./components/page/ErrorPage/PleaseLogin.jsx";
import CustomerRulersPage from "./components/page/NoticeAndConvention/CustomerRulersPage.jsx";
import AdminIndex from "./components/page/admin/AdminIndex.jsx";
import AdminMessageManage from "./components/page/admin/AdminMessageManage.jsx";
import AdminSeatsManage from "./components/page/admin/SeatManage/AdminSeatsManage.jsx";
import ViolationRecordPage from "./components/page/admin/ViolationRecordPage.jsx";
import OrderDateSelect from "./components/page/OrderSeatsView/OrderDateSelect.jsx";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Theme>
            <BrowserRouter>
                <Routes>
                    {/*<Route index element={<App />} />*/}
                    <Route index element={<Login />} />
                    <Route path={"/index"} element={<OrderDateSelect />} />
                    <Route path={"/register"} element={<Register />} />
                    <Route path={"/UserIndex"} element={<UserIndex />} />
                    <Route path={"/orderHistory"} element={<OrderHistory />} />
                    <Route path={"/error/unLogin"} element={<PleaseLogin />} />
                    <Route path={"/customer/rules"} element={<CustomerRulersPage />} />
                    <Route path={"/admin/index"} element={<AdminIndex />} />
                    <Route path={"/admin/message"} element={<AdminMessageManage />} />
                    <Route path={"/admin/seats"} element={<AdminSeatsManage />}/>
                    <Route path={"/admin/violation"} element={<ViolationRecordPage />}/>
                </Routes>
            </BrowserRouter>
        </Theme>
    </StrictMode>
)

