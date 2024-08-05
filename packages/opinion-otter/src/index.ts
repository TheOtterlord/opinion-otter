import type { StarlightPlugin } from '@astrojs/starlight/types'

export default function integration(): StarlightPlugin {
  return {
    name: 'opinion-otter/starlight',
    hooks: {
      setup: ({ addIntegration, astroConfig, updateConfig }) => {
        updateConfig({
          components: {
            Pagination: 'opinion-otter/components/Pagination.astro'
          }
        })
      }
    }
  }
}
