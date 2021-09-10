import { addCollection } from "@iconify/react"
const bundles = import.meta.glob("/icons/*.json")
for (const bundle in bundles) {
  bundles[bundle]().then((mod) => {
    addCollection(mod)
  })
}
