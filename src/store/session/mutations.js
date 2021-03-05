import jwt_decode from 'jwt-decode'

export function jwt (state, newToken) {
  state.jwt = newToken
  localStorage.setItem('sessionJwt', newToken)
}

export function username (state, newUsername) {
  state.username = newUsername
  localStorage.setItem('sessionUsername', newUsername)
}

export function userId (state, newUserId) {
  state.userId = newUserId
  localStorage.setItem('sessionUserId', newUserId)
}

export function userSession (state, newUserData) {
  state.jwt = newUserData.jwt
  state.userId = newUserData.user.id
  state.username = newUserData.user.username

  localStorage.setItem('sessionJwt', newUserData.jwt)
  localStorage.setItem('sessionUserId', newUserData.user.id)
  localStorage.setItem('sessionUsername', newUserData.user.username)

  let jwtObject = jwt_decode(newUserData.jwt)
  if (typeof jwtObject.exp === 'number') {
    state.expiry = jwtObject.exp
    localStorage.setItem('sessionExpiry', jwtObject.exp)
  }
}

export function wipe (state) {
  state.jwt = ''
  state.userId = ''
  state.username = ''
  state.expiry = 0
  localStorage.setItem('sessionJwt', '')
  localStorage.setItem('sessionUserId', '')
  localStorage.setItem('sessionUsername', '')
  localStorage.setItem('sessionExpiry', 0)
}
