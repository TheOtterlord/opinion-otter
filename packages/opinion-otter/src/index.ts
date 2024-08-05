import type { StarlightPlugin } from '@astrojs/starlight/types'
import icon from 'astro-icon'

export default function integration(): StarlightPlugin {
  return {
    name: 'opinion-otter/starlight',
    hooks: {
      setup: ({ addIntegration, astroConfig, updateConfig }) => {
        if (!astroConfig.integrations.find(i => i.name === 'astro-icon')) addIntegration(icon({ include: { 'material-symbols': ['*'] } }))

        updateConfig({
          components: {
            PageSidebar: 'opinion-otter/components/PageSidebar.astro'
          }
        })
      }
    }
  }
}
