import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserLayout from "./components/Layout/UserLayout.jsx";
import LoginPage from './components/page/LoginAndRegister/LoginPage.jsx'
import RegisterPage from './components/page/LoginAndRegister/RegisterPage.jsx'




createRoot(document.getElementById('root')).render(
    <StrictMode>

            <Theme >
                <BrowserRouter>
                    <Routes>
                        <Route index element={<LoginPage/>}/>
                        <Route path={"/register"} element={<RegisterPage />} />
                        <Route path={"/user/index"} element={<UserLayout />}/>
                    </Routes>
                </BrowserRouter>
            </Theme>

    </StrictMode>
)

