import { type GraphqlClient } from '@shopify/shopify-api';

export const CustomerFragment = `#graphql
  fragment CustomerFragment on Customer {
    id
    createdAt
    updatedAt
  }
`;

export async function getCustomer(graphql: GraphqlClient, id: string) {
  const { data } = await graphql.request(
    `#graphql
    
    ${CustomerFragment}

    query GetWebhookCustomer($id: ID!) {
      customer(id: $id) {
        ...CustomerFragment
      }
    }`,
    {
      variables: {
        id,
      },
    },
  );

  return data?.customer;
}
