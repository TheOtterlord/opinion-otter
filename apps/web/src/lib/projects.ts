import type { APIContext } from 'astro'
import { and, db, desc, eq, __opinionotter__Project, __opinionotter__Submission } from 'astro:db'
import { randomUUID } from 'node:crypto'

export async function createProject(project: Pick<typeof __opinionotter__Project.$inferInsert, 'title' | 'owner'>) {
  return (await db.insert(__opinionotter__Project).values({ id: randomUUID(), createdAt: Date.now(), ...project }).returning())[0]
}

export async function getProject(_: string, { request }: APIContext) {
  const params = new URL(request.url).searchParams

  const filters: unknown[] = []
  if (params.get('tag') && params.get('tag') !== 'all') filters.push(eq(__opinionotter__Submission.tag, params.get('tag')!))
  filters.push(eq(__opinionotter__Submission.status, params.get('state') ?? 'open'))

  const res = await db.select().from(__opinionotter__Project).orderBy(desc(__opinionotter__Submission.createdAt)).leftJoin(__opinionotter__Submission, and(eq(__opinionotter__Project.id, __opinionotter__Submission.project), ...filters))

  const data = res[0]
  if (!data?.__opinionotter__Project) return
  data.__opinionotter__Project.submissions = res.map(d => d.__opinionotter__Submission).filter(d => !!d)

  return data.__opinionotter__Project
}

export async function getProjectsByUser(userId: number) {
  const projects = await db.select().from(__opinionotter__Project).where(eq(__opinionotter__Project.owner, userId))

  return projects
}
