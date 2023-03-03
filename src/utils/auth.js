import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RequestHandKey = 'RequestHand'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRequestHand() {
  return Cookies.get(RequestHandKey)
}

export function setRequestHand(requestHandKey) {
  return Cookies.set(RequestHandKey, requestHandKey)
}

export function removeRequestHand() {
  return Cookies.remove(RequestHandKey)
}
