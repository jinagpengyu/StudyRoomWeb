import {useNavigate} from "react-router";
import {useEffect} from "react";

export default function PleaseLogin() {

    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            // 替换为目标路径
            navigate('/');
        }, 5000); // 10秒

        // 清除定时器
        return () => {
            clearTimeout(timer);
        };
    }, [navigate]); // 依赖navigate
    return (
        <>
            <h1>进入系统前请先登录,5S后自动跳转到登录页面</h1>
        </>
    )
}