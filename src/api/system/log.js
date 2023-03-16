import request from '@/utils/request'

export default {
  operateList(params) {
    return request({
      url: '/log/operate/list',
      method: 'get',
      params
    })
  },
  loginList(params) {
    return request({
      url: '/log/login/list',
      method: 'get',
      params
    })
  }
}

