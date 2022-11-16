import { Plugin, Store } from 'vuex/types'

const BLOCK_INTERVAL = 10
export const fetchBest: Plugin<App.State> = (store: Store<App.State>) => {
  if (process.browser) {
    const doUpdate = async () => {
      const best: DTO.Best = await store.$svc.best()
      store.commit('setBest', best)
    }
    setTimeout(() => {
      doUpdate().catch()
      setInterval(async () => {
        const now = Math.floor(Date.now() / 1000)
        if (store.state.best && now - store.state.best.timestamp >= BLOCK_INTERVAL) {
          await doUpdate()
        }
      }, 2 * 1000)
    }, 2 * 1000 - Date.now() % (2 * 1000))
  }
}

export const fetchPrice: Plugin<App.State> = (store: Store<App.State>) => {
  if (process.browser) {
    setInterval(async () => {
      const payload = await store.$svc.price()
      store.commit('setPrice', payload)
    }, 300000)
  }
}
