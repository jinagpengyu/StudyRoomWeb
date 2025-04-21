import {Flex} from "@radix-ui/themes";
import {useEffect, useState} from "react";

const api_url = import.meta.env.VITE_API_URL;
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
export default function Convention(){
    const [Conventions, setConventions] = useState([])
    useEffect(() => {
        GetConventions(setConventions)
    }, []);
    return (
        <Flex gap={'3'} m={'4'}>
            <table className="table table-bordered border-primary">
                <thead>
                <tr>
                    <th scope="col">序号</th>
                    <th scope="col">内容</th>
                </tr>
                </thead>
                <tbody>
                {
                    Conventions.map((convention, index) => (
                        <tr key={index}>
                            <th scope={'row'}>{index + 1}</th>
                            <th>{convention.context}</th>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </Flex>
    )
}