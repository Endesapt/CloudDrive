import axios from "axios";

const axiosApi=axios.create();


// Request interceptor for API calls
axiosApi.interceptors.request.use(
  async config => {
    const access_token=await getAccessToken(); 
    config.headers = { 
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config;
  },
  error => {
    Promise.reject(error)
});

//делаеи новый запрос с попыткой
axiosApi.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshToken();            
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      return axiosApi(originalRequest);
    }
    return Promise.reject(error);
});

function getAccessToken(){
    const token=window.localStorage.getItem("accessToken");
    return token;
}

async function refreshToken(){
  const {accessToken}=await axios.get("http://localhost:5000/api/refresh").then((res)=>{
    return res.data
  })
  window.localStorage.setItem("accessToken",accessToken);
  return accessToken;
}

export default axiosApi;