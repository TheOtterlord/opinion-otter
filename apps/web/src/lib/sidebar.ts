import type { AstroGlobal } from "astro"

export interface Item {
	title: string
	icon: string
	href: string
	active?: boolean
}

export interface Group {
	title: string
	icon: string
	items: Item[]
	active?: boolean
}

const items: (Item | Group)[] = [
  {
    title: 'Home',
    icon: 'material-symbols:dashboard-rounded',
    href: '/'
  },
  {
    title: 'Settings',
    icon: 'material-symbols:settings-rounded',
    href: '/settings/'
  }
]

export function getSidebar(Astro: AstroGlobal) {
  return structuredClone(items).map(item => {
    // if ('href' in item ) item.href = `/projects/${Astro.locals.project?.id}${item.href}`
    if ('href' in item ) item.href = `/app${item.href}`
    if ('href' in item && Astro.url.pathname === item.href) item.active = true
    else if ('items' in item && item.items.find(item => Astro.url.pathname.startsWith(item.href))) item.active = true
    return item
  })
}
