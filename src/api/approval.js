import request from '@/utils/request'

export default {
  all() {
    return request({
      url: '/approval/allApproval',
      method: 'get'
    })
  },
  me() {
    return request({
      url: '/approval/me',
      method: 'get'
    })
  },
  teachingGroupUnApproval() {
    return request({
      url: '/approval/unApproval/teachingGroup',
      method: 'get'
    })
  },
  secondaryCollegeUnApproval() {
    return request({
      url: '/approval/unApproval/secondaryCollege',
      method: 'get'
    })
  },
  academicAffairsOfficeUnApproval() {
    return request({
      url: '/approval/unApproval/academicAffairsOffice',
      method: 'get'
    })
  },
  teachingGroupAudit(id, data) {
    return request({
      url: `/approval/teachingGroup/${id}`,
      method: 'post',
      data
    })
  },
  secondaryCollegeAudit(id, data) {
    return request({
      url: `/approval/secondaryCollege/${id}`,
      method: 'post',
      data
    })
  },
  academicAffairsOfficeAudit(id, data) {
    return request({
      url: `/approval/academicAffairsOffice/${id}`,
      method: 'post',
      data
    })
  },
  submit(data) {
    return request({
      url: '/approval/submit',
      method: 'post',
      data
    })
  }
}

