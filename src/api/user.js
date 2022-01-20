import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function userList(listQuery) {
  return request({
    url: '/userlist',
    method: 'get',
    params: listQuery
  })
}

export function delUser(id) {
  return request({
    url: '/userlist/'+id,
    method: 'delete'
  })
}
