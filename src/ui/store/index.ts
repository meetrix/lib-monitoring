import createStore from 'unistore'
import { Provider, connect } from 'unistore/react'

export interface Peer {
  peerId: string
}

export interface Store {
  count: number
  peers: Peer[]
}

export const store = createStore<Store>({ count: 0, peers: [] })

export default store
