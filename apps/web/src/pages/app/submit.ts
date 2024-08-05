import type { APIRoute } from "astro"
import { z } from 'astro/zod'
import { getProject } from "../../lib/projects"
import { submit } from "../../lib/submission"
import { db, eq, __opinionotter__Tag, __opinionotter__Submission } from 'astro:db'

const createSchema = z.object({
  text: z.string(),
  tag: z.string(),

  email: z.string().optional(),
  device: z.string().optional(),
  page: z.string().optional()
})

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx
  const res = createSchema.safeParse(await request.json())

  if (!res.success) return Response.json({
    status: 'error',
    error: res.error.format()
  }, { status: 400 })

  const data = res.data

  const [project, tag]: [Awaited<ReturnType<typeof getProject>>, typeof __opinionotter__Tag.$inferSelect[]] = await Promise.all([
    getProject('', ctx),
    db.select().from(__opinionotter__Tag).where(eq(__opinionotter__Tag.slug, data.tag))
  ])

  if (!project) return Response.json({
    status: 'error',
    error: 'Project does not exist'
  }, { status: 404 })

  if (!tag || !tag.length) return Response.json({
    status: 'error',
    error: 'Tag does not exist'
  }, { status: 404 })

  const id = await submit({ project: project.id, ...data })

  return new Response()
}

const patchSchema = z.object({
  id: z.string(),
  tag: z.string().optional(),
  status: z.string().optional(),
})

export const PATCH: APIRoute = async (ctx) => {
  const { request, locals } = ctx

  if (!locals.user) return Response.json({
    status: 'error',
    error: 'Unauthorized'
  }, { status: 401 })

  const res = patchSchema.safeParse(await request.json())

  if (!res.success) return Response.json({
    status: 'error',
    error: res.error.format()
  }, { status: 400 })

  const data = res.data

  await db.update(__opinionotter__Submission).set(data).where(eq(__opinionotter__Submission.id, data.id))

  return new Response()
}

const deleteSchema = z.object({
  id: z.string()
})

export const DELETE: APIRoute = async (ctx) => {
  const { request, locals } = ctx

  if (!locals.user) return Response.json({
    status: 'error',
    error: 'Unauthorized'
  }, { status: 401 })

  const res = deleteSchema.safeParse(await request.json())

  if (!res.success) return Response.json({
    status: 'error',
    error: res.error.format()
  }, { status: 400 })

  const data = res.data

  await db.delete(__opinionotter__Submission).where(eq(__opinionotter__Submission.id, data.id))

  return new Response()
}
