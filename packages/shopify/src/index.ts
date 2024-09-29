import {
  ApiVersion,
  type GraphqlClient,
  type Session,
} from '@shopify/shopify-api';
import { createIntegration, env } from '@xentom/integration';
import * as actions from './actions';
import { createShopifyClient, type ShopifyClient } from './lib/shopify';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SHOP_NAME: string;
      API_KEY: string;
      API_SECRET_KEY: string;
      ADMIN_API_TOKEN: string;
    }
  }
}

declare module '@xentom/integration' {
  interface IntegrationState {
    shopify: ShopifyClient;
    session: Session;
    graphql: GraphqlClient;
  }
}

export default createIntegration({
  actions,

  env: {
    SHOP_NAME: env.string({
      label: 'Shop Name',
      description:
        'To find your shop name, look at the URL. For example, if the URL is https://example.myshopify.com, your shop name is example.',
      prefix: 'https://',
      suffix: '.myshopify.com',
    }),

    ADMIN_API_TOKEN: env.string({
      label: 'Admin API access token',
      isSensitive: true,
    }),

    API_KEY: env.string({
      label: 'API key',
    }),

    API_SECRET_KEY: env.string({
      label: 'API secret key',
      isSensitive: true,
    }),
  },

  onStart({ state, http }) {
    state.session = {
      shop: `${process.env.SHOP_NAME}.myshopify.com`,
      accessToken: process.env.ADMIN_API_TOKEN,
    } as Session;

    state.shopify = createShopifyClient(new URL(http.baseUrl));
    state.graphql = new state.shopify.clients.Graphql({
      session: state.session,
      apiVersion: ApiVersion.July24,
    });

    http.post('/webhooks', async (request) => {
      try {
        if (!request.body) {
          throw new Error('Invalid Shopify webhook request. No body found');
        }

        const response = new Response();
        await state.shopify.webhooks.process({
          rawBody: await request.text(),
          rawRequest: request,
          rawResponse: response,
          context: {},
        });

        return response;
      } catch (error) {
        console.log(`Failed to process shopify webhook:`, error);
        return new Response('Failed to process shopify webhook', {
          status: 500,
        });
      }
    });
  },
});
