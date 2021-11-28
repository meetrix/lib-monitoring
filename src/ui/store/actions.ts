import { connect } from 'unistore/preact'
import { Store, Peer, store } from './index'

export type ActionType = (s: Store, ...otherProps: any[]) => any

export const storeConnector = (fn: ActionType) => {
  return (...otherProps: any[]) => store.setState(fn(store.getState(), ...otherProps))
}
export const increment = ({ count }: { count: number }) => ({ count: count + 1 })
export const addPeer = ({ peers }: Store, peer: Peer) => ({
  peers: [...peers.filter(p => p.peerId !== peer.peerId), peer]
})
export const addPeerConnected = (peer: Peer) => storeConnector(addPeer)(peer)
