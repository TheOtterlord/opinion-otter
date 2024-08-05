import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import opinionOtter from 'opinion-otter'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Opinion Otter',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Get Started', slug: 'guides/start' },
					],
				},
			],
			plugins: [opinionOtter()],
		}),
	],
})
