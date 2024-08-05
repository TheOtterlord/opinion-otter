import { defineTable, column, NOW, defineDb } from 'astro:db'

const __opinionotter__User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
		url: column.text({ optional: true }),
		name: column.text(),
		email: column.text({ unique: true, optional: true }),
		avatar: column.text({ optional: true }),
		githubId: column.number({ unique: true }),
		username: column.text(),
		updatedAt: column.date({ default: NOW, nullable: true }),
		createdAt: column.date({ default: NOW, nullable: true }),
	},
})

const __opinionotter__Session = defineTable({
	columns: {
    id: column.text({ primaryKey: true }),
		userId: column.number({ references: () => __opinionotter__User.columns.id }),
		expiresAt: column.number(),
	},
})

const __opinionotter__Project = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    team: column.json({ default: [] }), // list of ids
    tags: column.json({ default: [] }), // list of ids
    submissions: column.json({ default: [] }), // list of ids
    owner: column.number(), // id
    createdAt: column.number(),
  }
})

const __opinionotter__Tag = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }),
    label: column.text(),
    project: column.text(), // id
    createdAt: column.number(),
  }
})

const __opinionotter__Submission = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    text: column.text(),
    project: column.text(), // id
    tag: column.text(), // id
    status: column.text({ default: 'open' }),

    // source info
    email: column.text({ optional: true }),
    device: column.text({ optional: true }),
    page: column.text({ optional: true }),

    createdAt: column.number(),
    updatedAt: column.number(),
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    __opinionotter__Project,
    __opinionotter__Session,
    __opinionotter__Submission,
    __opinionotter__Tag,
    __opinionotter__User,
  }
});
