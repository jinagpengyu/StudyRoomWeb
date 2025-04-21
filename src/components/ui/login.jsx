import '../../css/Login.css'
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useNavigate} from "react-router";
import {getCookie} from "../utils/cookie.js";
const api_url = import.meta.env.VITE_API_URL;
function Login_container(){
    let navigate = useNavigate();
    const [inputEmail, setInputEmail] = useState("");
    const [password, setInputPassword] = useState("");
    const handleOnLogin = () => {
        const requestBody = {
            email: inputEmail,
            password: password,
        }
        fetch(`${api_url}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            credentials:"include",
        })
        .then(response => {
            return response.json();
        }).then(response => {
            if(response.status === 200){
                navigate("/user/index");
            }
            if(response.status === 201){
                navigate("/admin/index");
            }

            console.log(`cookie:${document.cookie}`);
        })
    }
    const handleOnRegister = () => {
        navigate('/register');
    }
    return (
        <>
            <div className="position-absolute top-50 start-50 translate-middle w-50">
                <div className="container border border-3 p-4 w-50 ">
                    <Login_title />
                    <Login_userName
                        input_email={inputEmail}
                        setInputEmail={setInputEmail}
                        password={password}
                        setInputPassword={setInputPassword}
                    />
                    <div className={"d-flex"}>
                        <Login_button
                            onLogin={handleOnLogin}
                        />
                        <div className={"ms-2"}>
                            <Register_btn
                                onRegister={handleOnRegister}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Login_button({onLogin}) {
    return (
        <button className="btn btn-primary " onClick={onLogin}>登录</button>
    )
}
Login_button.propTypes = {
    onLogin: PropTypes.func.isRequired,
}

function Register_btn({onRegister}) {
    return (
        <button className={"btn btn-primary btn-block" } onClick={onRegister}>注册</button>
    )
}

Register_btn.propTypes = {
    onRegister: PropTypes.func.isRequired,
}

function Login_title(){
    return (
        <div className="text-center mb-3 fs-1">
            <p>登录</p>
        </div>
    )
}

function Login_userName({ input_email , setInputEmail , password, setInputPassword }) {

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="name@example.com"
                    value={ input_email }
                    onChange={ (e) =>{ setInputEmail( e.target.value ) } }
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="123456"
                    value={password}
                    onChange={(e) => {
                        setInputPassword(e.target.value)
                    }}
                />
            </div>
        </div>
    );
}

Login_userName.propTypes = {
    input_email: PropTypes.string,
    setInputEmail: PropTypes.func.isRequired,
    password: PropTypes.string,
    setInputPassword: PropTypes.func.isRequired,
}

export default function Login() {

    return (
        <Login_container/>
    )
}