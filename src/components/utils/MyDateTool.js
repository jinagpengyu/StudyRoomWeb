const api_url = import.meta.env.VITE_API_URL;
export async function GetSelectDate(){
    try {
        const response = await fetch(`${api_url}/tool/getSelectDate`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const result = await response.json();
        if(result.status === 200){
            const { todayDate, tomorrowDate } = result.data
            return [todayDate, tomorrowDate]
        }else{
            new Error("获取日期失败")
        }
    }catch (e) {
        console.error('报错：',e)
    }
}
