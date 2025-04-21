import {useEffect, useState} from "react";
import { List,Typography} from "antd";

const api_url = import.meta.env.VITE_API_URL;


export default function Convention(){
    const [Conventions, setConventions] = useState([])

    const GetConventions = async (setConventions) => {
        try {
            const response = await fetch(`${api_url}/user/getAllConvention`,{
                method:"POST",
                credentials:"include"
            })
            const result = await response.json()
            if(result.status === 200) setConventions(result.data)
            else throw new Error("无数据")
        }catch (e){
            console.error(e)
        }
    }
    useEffect(() => {
        GetConventions(setConventions)
    }, []);
    return (
        <>
            <List
                header={<div
                    style={{
                        textAlign: 'center',
                        fontSize: 40,
                    }}
                >自习室公约</div>}
                footer={<div>希望大家自觉遵守，共同维护自习室的环境和氛围，谢谢</div>}
                bordered
                dataSource={Conventions}
                renderItem={(item,index) => (
                    <List.Item>
                        <Typography.Text mark>[{index+1}]</Typography.Text> {item.context}
                    </List.Item>
                )}
                style={{
                    width:'75%',
                    margin:'20px auto 0',
                    background:"white"
                }}
            />
        </>
    )
}