/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		session: import("lucia/types").Session | null
		user: typeof import('lucia').User | null
    // projects?: typeof import('astro:db').__opinionotter__Project.$inferSelect[]
		project?: typeof import('astro:db').__opinionotter__Project.$inferSelect
	}
}
