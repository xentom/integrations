import { type GraphqlClient } from '@shopify/shopify-api';

export const CustomerSelectionFragment = `#graphql
fragment CustomerSelectionFragment on DiscountCustomerSelection {
  __typename

  ...on DiscountCustomerAll {
    allCustomers
  }

  ...on DiscountCustomerSegments {
    segments {
      id
      name
      query
      lastEditDate
      creationDate
    }
  }

  ...on DiscountCustomers {
    customers {
      id
    }
  }
}`;

export const DiscountCodeNodeFragment = `#graphql
  ${CustomerSelectionFragment}

  fragment DiscountCodeNodeFragment on DiscountCodeNode {
    id
    codeDiscount {
      __typename
      
      ...on DiscountCodeApp {
        title
        status
        asyncUsageCount
        appliesOncePerCustomer
        codesCount {
          count
          precision
        }
        combinesWith {
          orderDiscounts
          productDiscounts
          shippingDiscounts
        }
        customerSelection {
          ...CustomerSelectionFragment
        }
        startsAt
        endsAt
        createdAt
        updatedAt
      }
      
      ...on DiscountCodeBasic {
        title
        summary
        status
        asyncUsageCount
        appliesOncePerCustomer
        codesCount {
          count
          precision
        }
        combinesWith {
          orderDiscounts
          productDiscounts
          shippingDiscounts
        }
        customerSelection {
          ...CustomerSelectionFragment
        }
        startsAt
        endsAt
        createdAt
        updatedAt
      }

      ...on DiscountCodeBxgy {
        title
        summary
        status
        asyncUsageCount
        appliesOncePerCustomer
        codesCount {
          count
          precision
        }
        customerSelection {
          ...CustomerSelectionFragment
        }
        combinesWith {
          orderDiscounts
          productDiscounts
          shippingDiscounts
        }
        startsAt
        endsAt
        createdAt
        updatedAt
      }

      ...on DiscountCodeFreeShipping {
        title
        summary
        status
        asyncUsageCount
        appliesOnOneTimePurchase
        appliesOnSubscription
        appliesOncePerCustomer
        codesCount {
          count
          precision
        }
        combinesWith {
          orderDiscounts
          productDiscounts
          shippingDiscounts
        }
        customerSelection {
          ...CustomerSelectionFragment
        }
        startsAt
        endsAt
        createdAt
        updatedAt
      }
    }
  }
`;

export async function getDiscount(graphql: GraphqlClient, id: string) {
  const { data } = await graphql.request(
    `#graphql
    
    ${DiscountCodeNodeFragment}

    query GetWebhookDiscountCodeNode($id: ID!) {
      codeDiscountNode(id: $id) {
        ...DiscountCodeNodeFragment
      }
    }`,
    {
      variables: {
        id,
      },
    },
  );

  return data?.codeDiscountNode?.codeDiscount;
}
