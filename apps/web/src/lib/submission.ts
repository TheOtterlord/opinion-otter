import { db, desc, eq, __opinionotter__Submission } from 'astro:db'
import { randomUUID } from 'node:crypto'

const cache = new Map<string, typeof __opinionotter__Submission.$inferSelect>()
const cacheByProject = new Map<string, typeof __opinionotter__Submission.$inferSelect[]>()

export async function getSubmission(id: string) {
  if (cache.has(id)) return cache.get(id)!

  const projects = await db.select().from(__opinionotter__Submission).where(eq(__opinionotter__Submission.id, id)).limit(1)
  const project = projects[0]
  cache.set(id, project)

  return project
}

// TODO: implement limit
export async function getSubmissionsByProject(projectId: string, limit = 10, offset = 0) {
  // if (cacheByProject.has(projectId)) return cacheByProject.get(projectId)!
  const submissions = await db
    .select()
    .from(__opinionotter__Submission)
    .where(eq(__opinionotter__Submission.project, projectId))
    .orderBy(desc(__opinionotter__Submission.createdAt))
    .limit(10)
    .offset(offset)
    .all()

  cacheByProject.set(projectId, submissions)

  return submissions
}

export async function submit(submission: Omit<Omit<typeof __opinionotter__Submission.$inferInsert, 'createdAt'>, 'updatedAt'>) {
  const res = await db.insert(__opinionotter__Submission).values({ ...submission, id: randomUUID(), createdAt: Date.now(), updatedAt: Date.now() })
  return res.lastInsertRowid
}

export async function update(submission: Partial<Omit<typeof __opinionotter__Submission.$inferInsert, 'id'>>) {
  const res = await db.update(__opinionotter__Submission).set({ ...submission, id: randomUUID(), createdAt: Date.now(), updatedAt: Date.now() })
  return res.lastInsertRowid
}
