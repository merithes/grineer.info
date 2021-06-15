export default function () {
  return {
    fullPcData: typeof JSON.parse(localStorage.getItem('livePcDataContents')) === 'object' && JSON.parse(localStorage.getItem('livePcDataContents')) !== null ? JSON.parse(localStorage.getItem('livePcDataContents')) : {},
    pcDataTimestamp: typeof localStorage.getItem('livePcDataTimestamp') === 'object' && localStorage.getItem('livePcDataTimestamp') !== null ? localStorage.getItem('livePcDataTimestamp') : 0,
    fullPsData: typeof JSON.parse(localStorage.getItem('livePsDataContents')) === 'object' && JSON.parse(localStorage.getItem('livePsDataContents')) !== null ? JSON.parse(localStorage.getItem('livePsDataContents')) : {},
    psDataTimestamp: typeof localStorage.getItem('livePsDataTimestamp') === 'object' && localStorage.getItem('livePsDataTimestamp') !== null ? localStorage.getItem('livePsDataTimestamp') : 0,
    fullXbData: typeof JSON.parse(localStorage.getItem('liveXbDataContents')) === 'object' && JSON.parse(localStorage.getItem('liveXbDataContents')) !== null ? JSON.parse(localStorage.getItem('liveXbDataContents')) : {},
    xbDataTimestamp: typeof localStorage.getItem('liveXbDataTimestamp') === 'object' && localStorage.getItem('liveXbDataTimestamp') !== null ? localStorage.getItem('liveXbDataTimestamp') : 0,
    fullNiData: typeof JSON.parse(localStorage.getItem('liveNiDataContents')) === 'object' && JSON.parse(localStorage.getItem('liveNiDataContents')) !== null ? JSON.parse(localStorage.getItem('liveNiDataContents')) : {},
    niDataTimestamp: typeof localStorage.getItem('liveNiDataTimestamp') === 'object' && localStorage.getItem('liveNiDataTimestamp') !== null ? localStorage.getItem('livePcDataTimestamp') : 0,
  }
}
