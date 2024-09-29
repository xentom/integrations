import { type GraphqlClient } from '@shopify/shopify-api';
import { CustomerFragment } from './customers';

export const MailingAddressFragment = `#graphql
  fragment MailingAddressFragment on MailingAddress {
    address1
    address2
    city
    company
    coordinatesValidated
    country
    countryCodeV2
    firstName
    formatted
    formattedArea
    id
    lastName
    latitude
    longitude
    name
    phone
    province
    provinceCode
    timeZone
    validationResultSummary
    zip
  }
`;

export const MoneyBagFragment = `#graphql 
  fragment MoneyBagFragment on MoneyBag {
    presentmentMoney {
      amount
      currencyCode
    }
    shopMoney {
      amount
      currencyCode
    }
  }
`;

export const TaxLineFragment = `#graphql
  ${MoneyBagFragment}
  fragment TaxLineFragment on TaxLine {
    title
    rate
    ratePercentage
    priceSet {
      ...MoneyBagFragment
    }
  }
`;

export const OrderFragment = `#graphql
  ${CustomerFragment}
  ${MailingAddressFragment}
  ${MoneyBagFragment}
  ${TaxLineFragment}

  fragment OrderFragment on Order {
    id
    name
    note
    canMarkAsPaid
    canNotifyCustomer
    cancelReason
    cancellation {
      staffNote
    }
    cancelledAt
    capturable
    cartDiscountAmountSet {
      ...MoneyBagFragment
    }
    closed
    closedAt
    confirmationNumber
    confirmed
    currencyCode
    currentCartDiscountAmountSet {
      ...MoneyBagFragment
    }
    currentSubtotalLineItemsQuantity
    currentSubtotalPriceSet {
      ...MoneyBagFragment
    }
    currentTaxLines {
      ...TaxLineFragment
    }
    customer {
      ...CustomerFragment
    }
    customerLocale
    discountCode
    discountCodes
    displayAddress {
      ...MailingAddressFragment
    }
    displayFinancialStatus
    displayFulfillmentStatus
    edited
    estimatedTaxes
    fulfillable
    fullyPaid
    billingAddress {
      ...MailingAddressFragment
    }
    test
    unpaid
    createdAt
    updatedAt
  }
`;

export async function getOrder(graphql: GraphqlClient, id: string) {
  const { data } = await graphql.request(
    `#graphql
    
    ${OrderFragment}

    query GetWebhookOrder($id: ID!) {
      order(id: $id) {
        ...OrderFragment
      }
    }`,
    {
      variables: {
        id,
      },
    },
  );

  return data?.order;
}
