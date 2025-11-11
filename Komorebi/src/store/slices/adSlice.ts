import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Advertisement {
  id: string
  title: string
  description: string
  imageUrl: string
  targetUrl: string
  isActive: boolean
  startDate: string
  endDate?: string
  type: 'banner' | 'popup' | 'sidebar'
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

interface AdState {
  items: Advertisement[]
  activeAds: Advertisement[]
  showPopup: boolean
  currentPopupAd?: Advertisement
}

const initialState: AdState = {
  items: [],
  activeAds: [],
  showPopup: false
}

const adSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setAds: (state, action: PayloadAction<Advertisement[]>) => {
      state.items = action.payload
      state.activeAds = action.payload.filter(ad => ad.isActive)
    },
    
    addAd: (state, action: PayloadAction<Advertisement>) => {
      state.items.push(action.payload)
      if (action.payload.isActive) {
        state.activeAds.push(action.payload)
      }
    },
    
    updateAd: (state, action: PayloadAction<Advertisement>) => {
      const index = state.items.findIndex(ad => ad.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        state.activeAds = state.items.filter(ad => ad.isActive)
      }
    },
    
    removeAd: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(ad => ad.id !== action.payload)
      state.activeAds = state.items.filter(ad => ad.isActive)
    },
    
    showPopupAd: (state, action: PayloadAction<Advertisement>) => {
      state.currentPopupAd = action.payload
      state.showPopup = true
    },
    
    hidePopupAd: (state) => {
      state.showPopup = false
      state.currentPopupAd = undefined
    },
    
    toggleAdStatus: (state, action: PayloadAction<string>) => {
      const ad = state.items.find(ad => ad.id === action.payload)
      if (ad) {
        ad.isActive = !ad.isActive
        state.activeAds = state.items.filter(ad => ad.isActive)
      }
    }
  }
})

export const {
  setAds,
  addAd,
  updateAd,
  removeAd,
  showPopupAd,
  hidePopupAd,
  toggleAdStatus
} = adSlice.actions

// Selectors
export const selectAllAds = (state: { ads: AdState }) => state.ads.items
export const selectActiveAds = (state: { ads: AdState }) => state.ads.activeAds
export const selectAdsByType = (state: { ads: AdState }, type: Advertisement['type']) => 
  state.ads.activeAds.filter(ad => ad.type === type)
export const selectAdsByPosition = (state: { ads: AdState }, position: Advertisement['position']) => 
  state.ads.activeAds.filter(ad => ad.position === position)
export const selectPopupAd = (state: { ads: AdState }) => state.ads.currentPopupAd
export const selectShowPopup = (state: { ads: AdState }) => state.ads.showPopup

export default adSlice.reducer
