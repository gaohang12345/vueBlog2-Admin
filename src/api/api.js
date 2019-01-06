import axios from 'axios'

let base = 'http://localhost:3000'
// let base = ''

export const requestLogin = params => {
  return axios.post(`${base}/login`, params).then(res => res.data)
}

/**
 * @description 获取文章列表
 */
export const getArticleList = params => {
  return axios
    .get(`${base}/article/list`, { params: params })
    .then(res => res.data)
}

/**
 * @description 获取文章详情
 */
export const getArticleDetail = params => {
  return axios
    .get(`${base}/article/detail`, { params: params })
    .then(res => res.data)
}

/**
 * @description 新增文章
 */
export const addArticle = params => {
  return axios
    .post(`${base}/article/add`, { params: params })
    .then(res => res.data)
}

/**
 * @description 修改文章
 */
export const modifyArticle = params => {
  return axios
    .post(`${base}/article/modify`, { params: params })
    .then(res => res.data)
}

/**
 * @description 批量删除文章
 */
export const batchRemoveArticle = params => {
  return axios
    .post(`${base}/article/bacthRemove`, { params: params })
    .then(res => res.data)
}

/**
 * @description 删除文章
 */
export const removeArticle = params => {
  return axios
    .post(`${base}/article/remove`, { params: params })
    .then(res => res.data)
}

// 获取文章类型列表
export const getArticleTypeList = params => {
  return axios
    .get(`${base}/articleType/list`, { params: params })
    .then(res => res.data)
}

// 增加文章类型
export const addArticleType = params => {
  return axios
    .post(`${base}/articleType/add`, { params: params })
    .then(res => res.data)
}
