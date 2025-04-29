export function TodayAndTomorrow() {
    const now = new Date();
    // 将当前时间转换为UTC+8时区
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
    const chinaTime = new Date(utc + (8 * 60 * 60 * 1000));

    // 计算今天和明天的时间
    const today = new Date(chinaTime.getTime());
    const tomorrow = new Date(chinaTime.getTime() + 24 * 60 * 60 * 1000);

    // 格式化日期为年月日对象
    return {
        today_YYMMDD : today,
        tomorrow_YYMMDD : tomorrow
    }
}
// YYMMDD格式
export function TodayAndTomorrowYYDDMM() {
    const now = new Date(Date.now() + 8 * 3600 * 1000);
    const today = new Date(now);
    const tomorrow = new Date(now.setDate(now.getUTCDate() + 1));

    console.log("today:", today)
    console.log("tomorrow:", tomorrow)
    const format = date => {
        const yyyy = String(date.getUTCFullYear()); // 修改为完整年份
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(date.getUTCDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`; // 修改分隔符
    };

    return {
        today_YYMMDD: format(today),
        tomorrow_YYMMDD: format(tomorrow)
    }
}

export function CompareDate(CompareDate1,CompareDate2) {
    const date1 = new Date(CompareDate1);
    const date2 = new Date(CompareDate2);

    if(date1.getTime() > date2.getTime()){
        return 1;
    }else if(date1.getTime() < date2.getTime()){
        return -1;
    }else{
        return 0;
    }
}

export function GetSelectDateOptions(){
    const date = TodayAndTomorrowYYDDMM();
    return [
        {
            label:date.today_YYMMDD,
            value:date.today_YYMMDD
        },
        {
            label:date.tomorrow_YYMMDD,
            value:date.tomorrow_YYMMDD
        }
    ]
}
