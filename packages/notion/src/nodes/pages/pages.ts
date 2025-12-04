import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import * as pins from '@/pins'

const nodes = i.nodes.group('Pages')

export const getPage = nodes.callable({
  description: 'Retrieve a page by its ID',
  inputs: {
    id: pins.page.id,
  },
  outputs: {
    page: pins.page.item,
  },
  async run(opts) {
    const response = await opts.state.client.pages.retrieve({
      page_id: opts.inputs.id,
    })

    return opts.next({
      page: response as PageObjectResponse,
    })
  },
})

export const createPageInDatabase = nodes.callable({
  displayName: 'Create Page in Database',
  description: 'Create a new page inside a database with property values',
  inputs: {
    databaseId: pins.database.id.with({
      displayName: 'Database ID',
      description: 'The ID of the database where the page will be created.',
    }),
    properties: pins.page.createProperties.with({
      description: 'The property values for the new page.',
    }),
    icon: pins.page.createIcon.with({
      optional: true,
    }),
    cover: pins.page.createCover.with({
      optional: true,
    }),
    children: pins.block.children.with({
      description: 'Initial content blocks for the page body.',
      optional: true,
    }),
  },
  outputs: {
    page: pins.page.item,
  },
  async run(opts) {
    const response = await opts.state.client.pages.create({
      parent: { type: 'database_id', database_id: opts.inputs.databaseId },
      properties: opts.inputs.properties,
      icon: opts.inputs.icon,
      cover: opts.inputs.cover,
      children: opts.inputs.children,
    })

    return opts.next({
      page: response as PageObjectResponse,
    })
  },
})

export const createPageUnderPage = nodes.callable({
  displayName: 'Create Page Under Page',
  description: 'Create a new page as a child of another page',
  inputs: {
    parentPageId: pins.page.id.with({
      displayName: 'Parent Page ID',
      description: 'The ID of the parent page.',
    }),
    title: i.pins.data({
      displayName: 'Title',
      description: 'The title of the new page.',
      schema: v.pipe(v.string(), v.nonEmpty()),
      control: i.controls.text({
        placeholder: 'Page Title',
      }),
    }),
    icon: pins.page.createIcon.with({
      optional: true,
    }),
    cover: pins.page.createCover.with({
      optional: true,
    }),
    children: pins.block.children.with({
      description: 'Initial content blocks for the page body.',
      optional: true,
    }),
  },
  outputs: {
    page: pins.page.item,
  },
  async run(opts) {
    const response = await opts.state.client.pages.create({
      parent: { type: 'page_id', page_id: opts.inputs.parentPageId },
      properties: {
        title: {
          title: [{ type: 'text', text: { content: opts.inputs.title } }],
        },
      },
      icon: opts.inputs.icon,
      cover: opts.inputs.cover,
      children: opts.inputs.children,
    })

    return opts.next({
      page: response as PageObjectResponse,
    })
  },
})

export const updatePage = nodes.callable({
  description: 'Update page properties, icon, or cover',
  inputs: {
    id: pins.page.id,
    properties: pins.page.updateProperties.with({
      optional: true,
    }),
    icon: pins.page.updateIcon.with({
      optional: true,
    }),
    cover: pins.page.updateCover.with({
      optional: true,
    }),
  },
  outputs: {
    page: pins.page.item,
  },
  async run(opts) {
    const response = await opts.state.client.pages.update({
      page_id: opts.inputs.id,
      properties: opts.inputs.properties,
      icon: opts.inputs.icon,
      cover: opts.inputs.cover,
    })

    return opts.next({
      page: response as PageObjectResponse,
    })
  },
})

export const archivePage = nodes.callable({
  description: 'Archive (soft delete) a page',
  inputs: {
    id: pins.page.id,
  },
  outputs: {
    page: pins.page.item,
  },
  async run(opts) {
    const response = await opts.state.client.pages.update({
      page_id: opts.inputs.id,
      archived: true,
    })

    return opts.next({
      page: response as PageObjectResponse,
    })
  },
})

export const restorePage = nodes.callable({
  description: 'Restore an archived page',
  inputs: {
    id: pins.page.id,
  },
  outputs: {
    page: pins.page.item,
  },
  async run(opts) {
    const response = await opts.state.client.pages.update({
      page_id: opts.inputs.id,
      archived: false,
    })

    return opts.next({
      page: response as PageObjectResponse,
    })
  },
})

export const getPageProperty = nodes.callable({
  description: 'Retrieve a specific property value from a page',
  inputs: {
    pageId: pins.page.id.with({
      displayName: 'Page ID',
    }),
    propertyId: i.pins.data({
      displayName: 'Property ID',
      description: 'The ID of the property to retrieve.',
      schema: v.pipe(v.string(), v.nonEmpty()),
      control: i.controls.text({
        placeholder: 'Property ID',
      }),
    }),
  },
  outputs: {
    property: i.pins.data<unknown>({
      displayName: 'Property Value',
      description: 'The value of the requested property.',
    }),
  },
  async run(opts) {
    const response = await opts.state.client.pages.properties.retrieve({
      page_id: opts.inputs.pageId,
      property_id: opts.inputs.propertyId,
    })

    return opts.next({
      property: response,
    })
  },
})
