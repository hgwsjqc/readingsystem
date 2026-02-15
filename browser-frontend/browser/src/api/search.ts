import axios from './config';

export const doSearch=async (keyword:string)=>{
    return axios.get(`ai/search?keyword=${keyword}`);//如果连接后端接口使用
    // return axios.get(`/search?keyword=${keyword}`);//如果连接前端接口使用
}
