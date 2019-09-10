import axios from 'axios'
// http response 拦截器（所有接收到的请求都要从这儿过一次）
// process.env.BASE_URL
let instance = axios.create({
	baseURL:process.env.BASE_URL
})
instance.interceptors.response.use(
    response => {
    return response
});

export default instance;

