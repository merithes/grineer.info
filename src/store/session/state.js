export default function () {
  return {
    jwt: typeof localStorage.getItem('sessionJwt') === 'string' && localStorage.getItem('sessionJwt').length ? localStorage.getItem('sessionJwt') : '',
    expiry: typeof localStorage.getItem('sessionExpiry') === 'string' && localStorage.getItem('sessionExpiry').length ? localStorage.getItem('sessionExpiry') : '',
    username: typeof localStorage.getItem('sessionUsername') === 'string' && localStorage.getItem('sessionUsername').length ? localStorage.getItem('sessionUsername') : '',
    id: typeof localStorage.getItem('sessionUserId') === 'string' && localStorage.getItem('sessionUserId').length ? localStorage.getItem('sessionUserId') : ''
  }
}
