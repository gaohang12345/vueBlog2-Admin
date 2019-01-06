/**
 * 请求拦截器
 */

import axios from 'axios'

const CONTENT_TYPE = {
  post: 'application/x-www-form-urlencoded;charset=UTF-8',
  get: 'application/x-www-form-urlencoded;charset=UTF-8',
  upload: 'multipart/form-data'
}

// 创建axios实例，把基本的配置放进去
const instance = axios.create({
  // 定义请求文件类型
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000,
  // 定义请求根目录
  baseURL: 'http://localhost:3000/'
})

/** request拦截器==>对请求参数做处理 */
instance.interceptors.request.use(
  config => {
    // 全局loading

    if (config.method === 'post') {
      if (config.type === 'upload') {
        let formData = new FormData()
        formData.append('image', config.data)
        config.data = formData
      } else {
        config.data = qs.stringify(config.data)
      }
    }
    // 判断类型 添加不同数据格式
    config.headers['Content-Type'] = CONTENT_TYPE[config.type]
    // 添加token
    // config.headers['token'] = store.state.token || util.getLocalData('token')

    return config
  },
  error => {
    console.log('error')
    console.log(error)
    console.log(JSON.stringify(error))

    // 统一错误处理
    Promise.reject(error)
  }
)

/** respone拦截器==>对响应做处理 ******/
instance.interceptors.response.use(
  response => {
    // 成功请求到数据

    // 隐藏全局loading
    // util.hideLoading()

    let cfg = response.config.cfg || {}

    // 这里根据后端提供的数据进行对应的处理
    if (response.data.code === 0) {
      util.success(response.data.msg)
      return response.data
    }

    if (response.data.code === -1) {
      util.fail(response.data.msg)
      return response.data
    }
    if (response.data.code === -999) {
      // 跳转登录页面
    }
  },
  error => {
    // 响应错误处理
    console.log('error')
    console.log(error)
    console.log(JSON.stringify(error))

    if (
      // error.message === 'timeout of 10000ms exceeded' ||
      error.message.indexOf('timeout') >= 0 ||
      error.message === 'Network Error'
    ) {
      util.fail('网络异常，请重试！')
    } else {
      let errorObj = JSON.parse(JSON.stringify(error))
      if (errorObj && errorObj.response) {
        let text = errorObj.response.status === 404 ? '404' : '网络异常，请重试'
        util.fail(text)
      }
    }

    return Promise.reject(error)
  }
)

// 定义fetch函数，config为配置
let fetch = config => {
  // 返回promise对象
  return new Promise((resolve, reject) => {
    // 请求成功后执行的函数
    instance(config)
      .then(res => {
        console.log(res)
        resolve(res)
        // 失败后执行的函数
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

export default {
  /**
   * @param cfg: 自定义配置项
   */
  post: (url, data, cfg) => {
    return fetch({
      url: url,
      method: 'post',
      data: data,
      type: 'post',
      cfg: cfg
    })
  },
  upload: (url, data) => {
    return fetch({
      url: url,
      method: 'post',
      data: data,
      type: 'upload'
    })
  }
}
