import request from '@/utils/request'

export default {
  img() {
    return request({
      url: '/captcha/img',
      method: 'get'
    })
  },

  sms(params) {
    return request({
      url: '/captcha/sms',
      method: 'get',
      params
    })
  }
}

