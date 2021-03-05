export function updateData (state, newData) {
  state.fullData = newData
  state.dataTimestamp = Math.floor(Date.now() / 1000)
  localStorage.setItem('liveDataContents', JSON.stringify(newData))
}
