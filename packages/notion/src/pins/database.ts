import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type CreateDatabaseParameters,
  type DatabaseObjectResponse,
  type QueryDatabaseParameters,
  type QueryDatabaseResponse,
  type UpdateDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'

export const item = i.pins.data<DatabaseObjectResponse>({
  displayName: 'Database',
  description: 'A Notion database object.',
})

export const items = i.pins.data<DatabaseObjectResponse[]>({
  displayName: 'Databases',
  description: 'A list of Notion database objects.',
})

export const queryResult = i.pins.data<QueryDatabaseResponse>({
  displayName: 'Query Result',
  description: 'The result of a database query containing pages.',
})

export const id = i.pins.data({
  displayName: 'Database ID',
  description: 'The unique identifier of a Notion database.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'xxxxxxxx...',
  }),
})

export const title = i.pins.data({
  displayName: 'Title',
  description: 'The title of the database.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'My Database',
  }),
})

export const filter = i.pins.data<QueryDatabaseParameters['filter']>({
  displayName: 'Filter',
  description:
    'A filter object to narrow down query results. See Notion API documentation for filter syntax.',
  control: i.controls.expression(),
})

export const sorts = i.pins.data<QueryDatabaseParameters['sorts']>({
  displayName: 'Sorts',
  description:
    'An array of sort objects to order query results. See Notion API documentation for sort syntax.',
  control: i.controls.expression(),
})

export const createProperties = i.pins.data<
  CreateDatabaseParameters['properties']
>({
  displayName: 'Properties Schema',
  description:
    'The schema of database properties. Each key is a property name, value defines the property type.',
  control: i.controls.expression(),
  examples: [
    {
      title: 'Basic Properties',
      value: {
        Name: { title: {} },
        Description: { rich_text: {} },
        Status: {
          select: {
            options: [
              { name: 'To Do', color: 'gray' },
              { name: 'In Progress', color: 'blue' },
              { name: 'Done', color: 'green' },
            ],
          },
        },
      },
    },
  ],
})

export const updateProperties = i.pins.data<
  UpdateDatabaseParameters['properties']
>({
  displayName: 'Properties Schema',
  description:
    'Updated property schema. Properties not included will remain unchanged.',
  control: i.controls.expression(),
})
