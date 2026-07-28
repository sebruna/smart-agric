import axios from "axios";

//create a configured axios instance
const api = axios.create({
    baseURL: 'https://smart-agrics.onrender.com/api', 
    //points directly to Node.js server 'https://smart-agrics.onrender.com' http://localhost:4000/api
});
// Interceptor: Automaticall inject the bearer token before any request leaves the app
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        //set the exact authorization header your back end middleware expects
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error)=>{
    return Promise.reject(error);
}
);

export default api;