export function updatePcData (state, newData) {
  state.fullPcData = newData
  state.pcDataTimestamp = Math.floor(Date.now() / 1000)
  localStorage.setItem('livePcDataContents', JSON.stringify(newData))
  localStorage.setItem('livePcDataTimestamp', state.pcDataTimestamp)
}
export function updatePsData (state, newData) {
  state.fullPsData = newData
  state.psDataTimestamp = Math.floor(Date.now() / 1000)
  localStorage.setItem('livePsDataContents', JSON.stringify(newData))
  localStorage.setItem('livePsDataTimestamp', state.pcDataTimestamp)
}
export function updateXbData (state, newData) {
  state.fullXbData = newData
  state.xbDataTimestamp = Math.floor(Date.now() / 1000)
  localStorage.setItem('liveXbDataContents', JSON.stringify(newData))
  localStorage.setItem('liveXbDataTimestamp', state.pcDataTimestamp)
}
export function updateNiData (state, newData) {
  state.fullNiData = newData
  state.niDataTimestamp = Math.floor(Date.now() / 1000)
  localStorage.setItem('liveNiDataContents', JSON.stringify(newData))
  localStorage.setItem('liveNiDataTimestamp', state.pcDataTimestamp)
}
