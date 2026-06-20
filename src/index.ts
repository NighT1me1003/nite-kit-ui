import type { App, Component, Plugin } from 'vue'
import * as components from './components'
import './styles/components.css'

const installableComponents = Object.values(components) as Component[]

const NiteKit: Plugin = {
  install(app: App) {
    installableComponents.forEach((component) => {
      const name = (component as Component & { name?: string }).name

      if (name) {
        app.component(name, component)
      }
    })
  },
}

export * from './components'

export default NiteKit
