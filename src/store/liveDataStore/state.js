export default function () {
  return {
    fullData: typeof JSON.parse(localStorage.getItem('liveDataContents')) === 'object' && JSON.parse(localStorage.getItem('liveDataContents')) !== null ? JSON.parse(localStorage.getItem('liveDataContents')) : {},
    dataTimestamp: typeof localStorage.getItem('liveDataTimestamp') === 'object' && localStorage.getItem('liveDataTimestamp') !== null ? localStorage.getItem('liveDataTimestamp') : 0
  }
}
