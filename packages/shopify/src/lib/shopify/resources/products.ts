import { type GraphqlClient } from '@shopify/shopify-api';

export const ProductFragment = `#graphql
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    images(first: 50) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    tags
    status
    templateSuffix
    options {
      id
      name
      values
      position
    }
    vendor
    productType
    publishedAt
    createdAt
    updatedAt
  }
`;

export async function getProduct(graphql: GraphqlClient, id: string) {
  const { data } = await graphql.request(
    `#graphql
    
    ${ProductFragment}

    query GetWebhookProduct($id: ID!) {
      product(id: $id) {
        ...ProductFragment
      }
    }`,
    {
      variables: {
        id,
      },
    },
  );

  return data?.product;
}
