import {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

function Post_register(email,password,date,userName,navigate){
    const reqBody = {
        email: email,
        password: password,
        registrationDate:date,
        userName: userName,
    }
    fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody)
    }).then(response => {
        if (response.status === 302) {
            navigate('/');
        }
        if (response.status === 401) {
            throw new Error ("请求失败 状态码" + response.status);
        }
    }).then(r =>{
        console.log(r)
    }).catch(err=>{
        console.error("request error",err)
    })
}

export default function Register() {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('邮箱格式不正确');
    const emailRef = useRef(null);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('密码格式不正确，应有8-20个字符');
    const passwordRef = useRef(null);

    const [userName, setUserName] = useState('');

    const [passwordAgain, setPasswordAgain] = useState('');
    const [passwordAgainError, setPasswordAgainError] = useState(false);
    const [passwordAgainErrorMessage, setPasswordAgainErrorMessage] = useState('两次密码不匹配');
    const passwordAgainRef = useRef(null);
    // email is good type or not

    const time = new Date();
    const handleRegisterClick = () => {
        try{
            if(emailError || passwordError || passwordAgainError){
                console.error("error")
                return
            }
            Post_register(email,password,time.toDateString(),userName,navigate);

        }catch(err){
            console.error(err.message)
        }
    }
    const emailChange = (e) => {
        setEmail(e.target.value);
        emailRef.current = e.target.value;

    }
    const passwordChange =  (e) => {
        setPassword(e.target.value)
        passwordRef.current = e.target.value;
        
    }
    
    const passwordAgainChange = (e) => {
        setPasswordAgain(e.target.value);
        passwordAgainRef.current = e.target.value;
    }
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    function isValidPassword(password) {
        const regex = /^.{8,20}$/
        return regex.test(password);
    }
    useEffect(() => {
        const checkPasswordAgain = () => {
            console.log(`password:${passwordRef.current}\npasswordAgain:${passwordAgainRef.current}`);
            if(passwordRef.current === passwordAgainRef.current) {
                setPasswordAgainError(false);
            }else{
                setPasswordAgainError(true);
            }
        }
        const checkPassword = () => {
            if(!isValidPassword(passwordRef.current)){
                setPasswordError(true);
            }else{
                setPasswordError(false);
            }
        }
        const checkEmail = () => {
            if(!isValidEmail(emailRef.current)){
                setEmailError(true);
            }else{
                setEmailError(false);
            }
        }
        checkPassword();
        checkPasswordAgain();
        checkEmail();
    }, [passwordRef.current, passwordAgainRef.current,emailRef.current]);

    return (
        <>
            <div className={"position-absolute top-50 start-50 translate-middle w-25"}>
                <div className={"container border border-1 border-black "}>
                    <p className={"mt-4 text-center fw-bolder fs-2"}>注册账户</p>
                    <div className={"mb-4"}>
                        <label className={"form-label"} htmlFor="UserName">
                            User Name
                        </label>
                        <input className={"form-control"} id={"UserName"} placeholder={"tom"}
                               value={userName}
                               onChange={(e) => {
                                   setUserName(e.target.value)
                               }}/>
                    </div>
                    <div className={"mb-4"}>
                        <label className={"form-label"} htmlFor="email">
                            Email
                        </label>
                        <input className={"form-control"} id={"email"} placeholder={"email@example.com"}
                               value={email}
                               onChange={emailChange}
                        />
                    </div>
                    {emailError && <div className="alert alert-danger">{emailErrorMessage}</div>}
                    <div className={"mb-4"}>
                        <label className={"form-label"} htmlFor="password">
                            Password
                        </label>
                        <input className={"form-control"} id={"password"} placeholder={"8-20个字符"}
                               value={password} onChange={passwordChange}
                        />
                    </div>
                    {passwordError && <div className="alert alert-danger">{passwordErrorMessage}</div>}
                    <div className={"mb-4"}>
                        <label className={"form-label"} htmlFor="password-a">
                            Password Again
                        </label>

                        <input className={"form-control"} id={"password-a"} placeholder={"重复密码"}
                               value={passwordAgain} onChange={passwordAgainChange}/>
                    </div>
                    <div className={"mb-4"}>
                        <label className={"form-label"} htmlFor="password-a">
                            Phone Number
                        </label>

                        <input className={"form-control"} id={"password-a"} placeholder={"手机号"}
                               value={passwordAgain} onChange={passwordAgainChange}/>
                    </div>

                    {passwordAgainError && <div className="alert alert-danger">{passwordAgainErrorMessage}</div>}

                    <button type={"button"} className={"btn btn-outline-primary btn-block mb-4"}
                            onClick={handleRegisterClick}>register
                    </button>
                </div>
            </div>
        </>
    )
}

