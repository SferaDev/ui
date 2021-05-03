import { createContext } from 'react'

export const LayerContext = createContext({
    node: document.body,
    level: 0,
})