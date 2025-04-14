function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        cookie = cookie.split('=');
        if(name === cookie[0]) {
            return cookie[1];
        }
    }
    return null
}

export { getCookie };