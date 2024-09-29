import '@shopify/shopify-api/adapters/web-api';
import {
  ApiVersion,
  DeliveryMethod,
  shopifyApi,
  type ConfigParams,
  type Shopify,
} from '@shopify/shopify-api';
import {
  restResources,
  type RestResources,
} from '@shopify/shopify-api/rest/admin/2024-07';
import { type ActionRunContext } from '@xentom/integration';

export * from '@shopify/shopify-api/rest/admin/2024-07';

export type ShopifyClient = Shopify<ConfigParams<RestResources>, RestResources>;

export function createShopifyClient(url: URL): ShopifyClient {
  return shopifyApi({
    apiVersion: ApiVersion.July24,
    apiKey: process.env.API_KEY,
    apiSecretKey: process.env.API_SECRET_KEY,
    adminApiAccessToken: process.env.ADMIN_API_TOKEN,
    hostName: url.hostname,
    hostScheme: url.protocol.replace(':', '') as 'http' | 'https',
    isEmbeddedApp: false,
    restResources,
    future: {
      customerAddressDefaultFix: true,
      lineItemBilling: true,
      v10_lineItemBilling: false,
      unstable_managedPricingSupport: false,
    },
  });
}

let registerWebhookThrottle: Timer;

export interface CreateWebhookHandlerPayload {
  topic: string;
  callback: (data: any) => Promise<void> | void;
}

export function createWebhookHandler(
  context: ActionRunContext,
  payload: CreateWebhookHandlerPayload,
) {
  context.state.shopify.webhooks.addHandlers({
    [payload.topic]: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: `${context.http.baseUrl}/webhooks`,
        async callback(_topic, _shop_name, body) {
          await payload.callback(JSON.parse(body));
        },
      },
    ],
  });

  clearTimeout(registerWebhookThrottle);
  registerWebhookThrottle = setTimeout(() => {
    context.state.shopify.webhooks.register({
      session: context.state.session,
    });
  }, 500);
}
