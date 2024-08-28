

const AuthHeaders = () => {
    const headers = {
        'Content-Type': 'application/json'
    }
    const data = localStorage.getItem("user");
    
    if (!data) {
        return headers ;
    }
    
    const user = JSON.parse(data);
    if (user?.token) {
        // console.log(user.token);
        
        return {...headers, Authorization: `Bearer ${user.token}` };
    }
    return {};
}

export default AuthHeaders;