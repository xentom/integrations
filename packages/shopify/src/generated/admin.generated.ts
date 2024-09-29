/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types';

export type CustomerFragment = Pick<
  AdminTypes.Customer,
  'id' | 'createdAt' | 'updatedAt'
>;

export type GetWebhookCustomerQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;

export type GetWebhookCustomerQuery = {
  customer?: AdminTypes.Maybe<
    Pick<AdminTypes.Customer, 'id' | 'createdAt' | 'updatedAt'>
  >;
};

type CustomerSelectionFragment_DiscountCustomerAll = {
  __typename: 'DiscountCustomerAll';
} & Pick<AdminTypes.DiscountCustomerAll, 'allCustomers'>;

type CustomerSelectionFragment_DiscountCustomerSegments = {
  __typename: 'DiscountCustomerSegments';
} & {
  segments: Array<
    Pick<
      AdminTypes.Segment,
      'id' | 'name' | 'query' | 'lastEditDate' | 'creationDate'
    >
  >;
};

type CustomerSelectionFragment_DiscountCustomers = {
  __typename: 'DiscountCustomers';
} & { customers: Array<Pick<AdminTypes.Customer, 'id'>> };

export type CustomerSelectionFragment =
  | CustomerSelectionFragment_DiscountCustomerAll
  | CustomerSelectionFragment_DiscountCustomerSegments
  | CustomerSelectionFragment_DiscountCustomers;

export type DiscountCodeNodeFragment = Pick<
  AdminTypes.DiscountCodeNode,
  'id'
> & {
  codeDiscount:
    | ({ __typename: 'DiscountCodeApp' } & Pick<
        AdminTypes.DiscountCodeApp,
        | 'title'
        | 'status'
        | 'asyncUsageCount'
        | 'appliesOncePerCustomer'
        | 'startsAt'
        | 'endsAt'
        | 'createdAt'
        | 'updatedAt'
      > & {
          codesCount?: AdminTypes.Maybe<
            Pick<AdminTypes.Count, 'count' | 'precision'>
          >;
          combinesWith: Pick<
            AdminTypes.DiscountCombinesWith,
            'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
          >;
          customerSelection:
            | ({ __typename: 'DiscountCustomerAll' } & Pick<
                AdminTypes.DiscountCustomerAll,
                'allCustomers'
              >)
            | ({ __typename: 'DiscountCustomerSegments' } & {
                segments: Array<
                  Pick<
                    AdminTypes.Segment,
                    'id' | 'name' | 'query' | 'lastEditDate' | 'creationDate'
                  >
                >;
              })
            | ({ __typename: 'DiscountCustomers' } & {
                customers: Array<Pick<AdminTypes.Customer, 'id'>>;
              });
        })
    | ({ __typename: 'DiscountCodeBasic' } & Pick<
        AdminTypes.DiscountCodeBasic,
        | 'title'
        | 'summary'
        | 'status'
        | 'asyncUsageCount'
        | 'appliesOncePerCustomer'
        | 'startsAt'
        | 'endsAt'
        | 'createdAt'
        | 'updatedAt'
      > & {
          codesCount?: AdminTypes.Maybe<
            Pick<AdminTypes.Count, 'count' | 'precision'>
          >;
          combinesWith: Pick<
            AdminTypes.DiscountCombinesWith,
            'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
          >;
          customerSelection:
            | ({ __typename: 'DiscountCustomerAll' } & Pick<
                AdminTypes.DiscountCustomerAll,
                'allCustomers'
              >)
            | ({ __typename: 'DiscountCustomerSegments' } & {
                segments: Array<
                  Pick<
                    AdminTypes.Segment,
                    'id' | 'name' | 'query' | 'lastEditDate' | 'creationDate'
                  >
                >;
              })
            | ({ __typename: 'DiscountCustomers' } & {
                customers: Array<Pick<AdminTypes.Customer, 'id'>>;
              });
        })
    | ({ __typename: 'DiscountCodeBxgy' } & Pick<
        AdminTypes.DiscountCodeBxgy,
        | 'title'
        | 'summary'
        | 'status'
        | 'asyncUsageCount'
        | 'appliesOncePerCustomer'
        | 'startsAt'
        | 'endsAt'
        | 'createdAt'
        | 'updatedAt'
      > & {
          codesCount?: AdminTypes.Maybe<
            Pick<AdminTypes.Count, 'count' | 'precision'>
          >;
          customerSelection:
            | ({ __typename: 'DiscountCustomerAll' } & Pick<
                AdminTypes.DiscountCustomerAll,
                'allCustomers'
              >)
            | ({ __typename: 'DiscountCustomerSegments' } & {
                segments: Array<
                  Pick<
                    AdminTypes.Segment,
                    'id' | 'name' | 'query' | 'lastEditDate' | 'creationDate'
                  >
                >;
              })
            | ({ __typename: 'DiscountCustomers' } & {
                customers: Array<Pick<AdminTypes.Customer, 'id'>>;
              });
          combinesWith: Pick<
            AdminTypes.DiscountCombinesWith,
            'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
          >;
        })
    | ({ __typename: 'DiscountCodeFreeShipping' } & Pick<
        AdminTypes.DiscountCodeFreeShipping,
        | 'title'
        | 'summary'
        | 'status'
        | 'asyncUsageCount'
        | 'appliesOnOneTimePurchase'
        | 'appliesOnSubscription'
        | 'appliesOncePerCustomer'
        | 'startsAt'
        | 'endsAt'
        | 'createdAt'
        | 'updatedAt'
      > & {
          codesCount?: AdminTypes.Maybe<
            Pick<AdminTypes.Count, 'count' | 'precision'>
          >;
          combinesWith: Pick<
            AdminTypes.DiscountCombinesWith,
            'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
          >;
          customerSelection:
            | ({ __typename: 'DiscountCustomerAll' } & Pick<
                AdminTypes.DiscountCustomerAll,
                'allCustomers'
              >)
            | ({ __typename: 'DiscountCustomerSegments' } & {
                segments: Array<
                  Pick<
                    AdminTypes.Segment,
                    'id' | 'name' | 'query' | 'lastEditDate' | 'creationDate'
                  >
                >;
              })
            | ({ __typename: 'DiscountCustomers' } & {
                customers: Array<Pick<AdminTypes.Customer, 'id'>>;
              });
        });
};

export type GetWebhookDiscountCodeNodeQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;

export type GetWebhookDiscountCodeNodeQuery = {
  codeDiscountNode?: AdminTypes.Maybe<
    Pick<AdminTypes.DiscountCodeNode, 'id'> & {
      codeDiscount:
        | ({ __typename: 'DiscountCodeApp' } & Pick<
            AdminTypes.DiscountCodeApp,
            | 'title'
            | 'status'
            | 'asyncUsageCount'
            | 'appliesOncePerCustomer'
            | 'startsAt'
            | 'endsAt'
            | 'createdAt'
            | 'updatedAt'
          > & {
              codesCount?: AdminTypes.Maybe<
                Pick<AdminTypes.Count, 'count' | 'precision'>
              >;
              combinesWith: Pick<
                AdminTypes.DiscountCombinesWith,
                'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
              >;
              customerSelection:
                | ({ __typename: 'DiscountCustomerAll' } & Pick<
                    AdminTypes.DiscountCustomerAll,
                    'allCustomers'
                  >)
                | ({ __typename: 'DiscountCustomerSegments' } & {
                    segments: Array<
                      Pick<
                        AdminTypes.Segment,
                        | 'id'
                        | 'name'
                        | 'query'
                        | 'lastEditDate'
                        | 'creationDate'
                      >
                    >;
                  })
                | ({ __typename: 'DiscountCustomers' } & {
                    customers: Array<Pick<AdminTypes.Customer, 'id'>>;
                  });
            })
        | ({ __typename: 'DiscountCodeBasic' } & Pick<
            AdminTypes.DiscountCodeBasic,
            | 'title'
            | 'summary'
            | 'status'
            | 'asyncUsageCount'
            | 'appliesOncePerCustomer'
            | 'startsAt'
            | 'endsAt'
            | 'createdAt'
            | 'updatedAt'
          > & {
              codesCount?: AdminTypes.Maybe<
                Pick<AdminTypes.Count, 'count' | 'precision'>
              >;
              combinesWith: Pick<
                AdminTypes.DiscountCombinesWith,
                'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
              >;
              customerSelection:
                | ({ __typename: 'DiscountCustomerAll' } & Pick<
                    AdminTypes.DiscountCustomerAll,
                    'allCustomers'
                  >)
                | ({ __typename: 'DiscountCustomerSegments' } & {
                    segments: Array<
                      Pick<
                        AdminTypes.Segment,
                        | 'id'
                        | 'name'
                        | 'query'
                        | 'lastEditDate'
                        | 'creationDate'
                      >
                    >;
                  })
                | ({ __typename: 'DiscountCustomers' } & {
                    customers: Array<Pick<AdminTypes.Customer, 'id'>>;
                  });
            })
        | ({ __typename: 'DiscountCodeBxgy' } & Pick<
            AdminTypes.DiscountCodeBxgy,
            | 'title'
            | 'summary'
            | 'status'
            | 'asyncUsageCount'
            | 'appliesOncePerCustomer'
            | 'startsAt'
            | 'endsAt'
            | 'createdAt'
            | 'updatedAt'
          > & {
              codesCount?: AdminTypes.Maybe<
                Pick<AdminTypes.Count, 'count' | 'precision'>
              >;
              customerSelection:
                | ({ __typename: 'DiscountCustomerAll' } & Pick<
                    AdminTypes.DiscountCustomerAll,
                    'allCustomers'
                  >)
                | ({ __typename: 'DiscountCustomerSegments' } & {
                    segments: Array<
                      Pick<
                        AdminTypes.Segment,
                        | 'id'
                        | 'name'
                        | 'query'
                        | 'lastEditDate'
                        | 'creationDate'
                      >
                    >;
                  })
                | ({ __typename: 'DiscountCustomers' } & {
                    customers: Array<Pick<AdminTypes.Customer, 'id'>>;
                  });
              combinesWith: Pick<
                AdminTypes.DiscountCombinesWith,
                'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
              >;
            })
        | ({ __typename: 'DiscountCodeFreeShipping' } & Pick<
            AdminTypes.DiscountCodeFreeShipping,
            | 'title'
            | 'summary'
            | 'status'
            | 'asyncUsageCount'
            | 'appliesOnOneTimePurchase'
            | 'appliesOnSubscription'
            | 'appliesOncePerCustomer'
            | 'startsAt'
            | 'endsAt'
            | 'createdAt'
            | 'updatedAt'
          > & {
              codesCount?: AdminTypes.Maybe<
                Pick<AdminTypes.Count, 'count' | 'precision'>
              >;
              combinesWith: Pick<
                AdminTypes.DiscountCombinesWith,
                'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'
              >;
              customerSelection:
                | ({ __typename: 'DiscountCustomerAll' } & Pick<
                    AdminTypes.DiscountCustomerAll,
                    'allCustomers'
                  >)
                | ({ __typename: 'DiscountCustomerSegments' } & {
                    segments: Array<
                      Pick<
                        AdminTypes.Segment,
                        | 'id'
                        | 'name'
                        | 'query'
                        | 'lastEditDate'
                        | 'creationDate'
                      >
                    >;
                  })
                | ({ __typename: 'DiscountCustomers' } & {
                    customers: Array<Pick<AdminTypes.Customer, 'id'>>;
                  });
            });
    }
  >;
};

export type MailingAddressFragment = Pick<
  AdminTypes.MailingAddress,
  | 'address1'
  | 'address2'
  | 'city'
  | 'company'
  | 'coordinatesValidated'
  | 'country'
  | 'countryCodeV2'
  | 'firstName'
  | 'formatted'
  | 'formattedArea'
  | 'id'
  | 'lastName'
  | 'latitude'
  | 'longitude'
  | 'name'
  | 'phone'
  | 'province'
  | 'provinceCode'
  | 'timeZone'
  | 'validationResultSummary'
  | 'zip'
>;

export type MoneyBagFragment = {
  presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
  shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
};

export type TaxLineFragment = Pick<
  AdminTypes.TaxLine,
  'title' | 'rate' | 'ratePercentage'
> & {
  priceSet: {
    presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
    shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type OrderFragment = Pick<
  AdminTypes.Order,
  | 'id'
  | 'name'
  | 'note'
  | 'canMarkAsPaid'
  | 'canNotifyCustomer'
  | 'cancelReason'
  | 'cancelledAt'
  | 'capturable'
  | 'closed'
  | 'closedAt'
  | 'confirmationNumber'
  | 'confirmed'
  | 'currencyCode'
  | 'currentSubtotalLineItemsQuantity'
  | 'customerLocale'
  | 'discountCode'
  | 'discountCodes'
  | 'displayFinancialStatus'
  | 'displayFulfillmentStatus'
  | 'edited'
  | 'estimatedTaxes'
  | 'fulfillable'
  | 'fullyPaid'
  | 'test'
  | 'unpaid'
  | 'createdAt'
  | 'updatedAt'
> & {
  cancellation?: AdminTypes.Maybe<
    Pick<AdminTypes.OrderCancellation, 'staffNote'>
  >;
  cartDiscountAmountSet?: AdminTypes.Maybe<{
    presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
    shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
  }>;
  currentCartDiscountAmountSet: {
    presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
    shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
  };
  currentSubtotalPriceSet: {
    presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
    shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
  };
  currentTaxLines: Array<
    Pick<AdminTypes.TaxLine, 'title' | 'rate' | 'ratePercentage'> & {
      priceSet: {
        presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
        shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
      };
    }
  >;
  customer?: AdminTypes.Maybe<
    Pick<AdminTypes.Customer, 'id' | 'createdAt' | 'updatedAt'>
  >;
  displayAddress?: AdminTypes.Maybe<
    Pick<
      AdminTypes.MailingAddress,
      | 'address1'
      | 'address2'
      | 'city'
      | 'company'
      | 'coordinatesValidated'
      | 'country'
      | 'countryCodeV2'
      | 'firstName'
      | 'formatted'
      | 'formattedArea'
      | 'id'
      | 'lastName'
      | 'latitude'
      | 'longitude'
      | 'name'
      | 'phone'
      | 'province'
      | 'provinceCode'
      | 'timeZone'
      | 'validationResultSummary'
      | 'zip'
    >
  >;
  billingAddress?: AdminTypes.Maybe<
    Pick<
      AdminTypes.MailingAddress,
      | 'address1'
      | 'address2'
      | 'city'
      | 'company'
      | 'coordinatesValidated'
      | 'country'
      | 'countryCodeV2'
      | 'firstName'
      | 'formatted'
      | 'formattedArea'
      | 'id'
      | 'lastName'
      | 'latitude'
      | 'longitude'
      | 'name'
      | 'phone'
      | 'province'
      | 'provinceCode'
      | 'timeZone'
      | 'validationResultSummary'
      | 'zip'
    >
  >;
};

export type GetWebhookOrderQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;

export type GetWebhookOrderQuery = {
  order?: AdminTypes.Maybe<
    Pick<
      AdminTypes.Order,
      | 'id'
      | 'name'
      | 'note'
      | 'canMarkAsPaid'
      | 'canNotifyCustomer'
      | 'cancelReason'
      | 'cancelledAt'
      | 'capturable'
      | 'closed'
      | 'closedAt'
      | 'confirmationNumber'
      | 'confirmed'
      | 'currencyCode'
      | 'currentSubtotalLineItemsQuantity'
      | 'customerLocale'
      | 'discountCode'
      | 'discountCodes'
      | 'displayFinancialStatus'
      | 'displayFulfillmentStatus'
      | 'edited'
      | 'estimatedTaxes'
      | 'fulfillable'
      | 'fullyPaid'
      | 'test'
      | 'unpaid'
      | 'createdAt'
      | 'updatedAt'
    > & {
      cancellation?: AdminTypes.Maybe<
        Pick<AdminTypes.OrderCancellation, 'staffNote'>
      >;
      cartDiscountAmountSet?: AdminTypes.Maybe<{
        presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
        shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
      }>;
      currentCartDiscountAmountSet: {
        presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
        shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
      };
      currentSubtotalPriceSet: {
        presentmentMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
        shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
      };
      currentTaxLines: Array<
        Pick<AdminTypes.TaxLine, 'title' | 'rate' | 'ratePercentage'> & {
          priceSet: {
            presentmentMoney: Pick<
              AdminTypes.MoneyV2,
              'amount' | 'currencyCode'
            >;
            shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'>;
          };
        }
      >;
      customer?: AdminTypes.Maybe<
        Pick<AdminTypes.Customer, 'id' | 'createdAt' | 'updatedAt'>
      >;
      displayAddress?: AdminTypes.Maybe<
        Pick<
          AdminTypes.MailingAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'coordinatesValidated'
          | 'country'
          | 'countryCodeV2'
          | 'firstName'
          | 'formatted'
          | 'formattedArea'
          | 'id'
          | 'lastName'
          | 'latitude'
          | 'longitude'
          | 'name'
          | 'phone'
          | 'province'
          | 'provinceCode'
          | 'timeZone'
          | 'validationResultSummary'
          | 'zip'
        >
      >;
      billingAddress?: AdminTypes.Maybe<
        Pick<
          AdminTypes.MailingAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'coordinatesValidated'
          | 'country'
          | 'countryCodeV2'
          | 'firstName'
          | 'formatted'
          | 'formattedArea'
          | 'id'
          | 'lastName'
          | 'latitude'
          | 'longitude'
          | 'name'
          | 'phone'
          | 'province'
          | 'provinceCode'
          | 'timeZone'
          | 'validationResultSummary'
          | 'zip'
        >
      >;
    }
  >;
};

export type ProductFragment = Pick<
  AdminTypes.Product,
  | 'id'
  | 'handle'
  | 'title'
  | 'description'
  | 'descriptionHtml'
  | 'tags'
  | 'status'
  | 'templateSuffix'
  | 'vendor'
  | 'productType'
  | 'publishedAt'
  | 'createdAt'
  | 'updatedAt'
> & {
  images: {
    nodes: Array<
      Pick<AdminTypes.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
    >;
  };
  options: Array<
    Pick<AdminTypes.ProductOption, 'id' | 'name' | 'values' | 'position'>
  >;
};

export type GetWebhookProductQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;

export type GetWebhookProductQuery = {
  product?: AdminTypes.Maybe<
    Pick<
      AdminTypes.Product,
      | 'id'
      | 'handle'
      | 'title'
      | 'description'
      | 'descriptionHtml'
      | 'tags'
      | 'status'
      | 'templateSuffix'
      | 'vendor'
      | 'productType'
      | 'publishedAt'
      | 'createdAt'
      | 'updatedAt'
    > & {
      images: {
        nodes: Array<
          Pick<AdminTypes.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
        >;
      };
      options: Array<
        Pick<AdminTypes.ProductOption, 'id' | 'name' | 'values' | 'position'>
      >;
    }
  >;
};

interface GeneratedQueryTypes {
  '#graphql\n    \n    #graphql\n  fragment CustomerFragment on Customer {\n    id\n    createdAt\n    updatedAt\n  }\n\n\n    query GetWebhookCustomer($id: ID!) {\n      customer(id: $id) {\n        ...CustomerFragment\n      }\n    }': {
    return: GetWebhookCustomerQuery;
    variables: GetWebhookCustomerQueryVariables;
  };
  '#graphql\n    \n    #graphql\n  #graphql\nfragment CustomerSelectionFragment on DiscountCustomerSelection {\n  __typename\n\n  ...on DiscountCustomerAll {\n    allCustomers\n  }\n\n  ...on DiscountCustomerSegments {\n    segments {\n      id\n      name\n      query\n      lastEditDate\n      creationDate\n    }\n  }\n\n  ...on DiscountCustomers {\n    customers {\n      id\n    }\n  }\n}\n\n  fragment DiscountCodeNodeFragment on DiscountCodeNode {\n    id\n    codeDiscount {\n      __typename\n      \n      ...on DiscountCodeApp {\n        title\n        status\n        asyncUsageCount\n        appliesOncePerCustomer\n        codesCount {\n          count\n          precision\n        }\n        combinesWith {\n          orderDiscounts\n          productDiscounts\n          shippingDiscounts\n        }\n        customerSelection {\n          ...CustomerSelectionFragment\n        }\n        startsAt\n        endsAt\n        createdAt\n        updatedAt\n      }\n      \n      ...on DiscountCodeBasic {\n        title\n        summary\n        status\n        asyncUsageCount\n        appliesOncePerCustomer\n        codesCount {\n          count\n          precision\n        }\n        combinesWith {\n          orderDiscounts\n          productDiscounts\n          shippingDiscounts\n        }\n        customerSelection {\n          ...CustomerSelectionFragment\n        }\n        startsAt\n        endsAt\n        createdAt\n        updatedAt\n      }\n\n      ...on DiscountCodeBxgy {\n        title\n        summary\n        status\n        asyncUsageCount\n        appliesOncePerCustomer\n        codesCount {\n          count\n          precision\n        }\n        customerSelection {\n          ...CustomerSelectionFragment\n        }\n        combinesWith {\n          orderDiscounts\n          productDiscounts\n          shippingDiscounts\n        }\n        startsAt\n        endsAt\n        createdAt\n        updatedAt\n      }\n\n      ...on DiscountCodeFreeShipping {\n        title\n        summary\n        status\n        asyncUsageCount\n        appliesOnOneTimePurchase\n        appliesOnSubscription\n        appliesOncePerCustomer\n        codesCount {\n          count\n          precision\n        }\n        combinesWith {\n          orderDiscounts\n          productDiscounts\n          shippingDiscounts\n        }\n        customerSelection {\n          ...CustomerSelectionFragment\n        }\n        startsAt\n        endsAt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n\n\n    query GetWebhookDiscountCodeNode($id: ID!) {\n      codeDiscountNode(id: $id) {\n        ...DiscountCodeNodeFragment\n      }\n    }': {
    return: GetWebhookDiscountCodeNodeQuery;
    variables: GetWebhookDiscountCodeNodeQueryVariables;
  };
  '#graphql\n    \n    #graphql\n  #graphql\n  fragment CustomerFragment on Customer {\n    id\n    createdAt\n    updatedAt\n  }\n\n  #graphql\n  fragment MailingAddressFragment on MailingAddress {\n    address1\n    address2\n    city\n    company\n    coordinatesValidated\n    country\n    countryCodeV2\n    firstName\n    formatted\n    formattedArea\n    id\n    lastName\n    latitude\n    longitude\n    name\n    phone\n    province\n    provinceCode\n    timeZone\n    validationResultSummary\n    zip\n  }\n\n  #graphql \n  fragment MoneyBagFragment on MoneyBag {\n    presentmentMoney {\n      amount\n      currencyCode\n    }\n    shopMoney {\n      amount\n      currencyCode\n    }\n  }\n\n  #graphql\n  #graphql \n  fragment MoneyBagFragment on MoneyBag {\n    presentmentMoney {\n      amount\n      currencyCode\n    }\n    shopMoney {\n      amount\n      currencyCode\n    }\n  }\n\n  fragment TaxLineFragment on TaxLine {\n    title\n    rate\n    ratePercentage\n    priceSet {\n      ...MoneyBagFragment\n    }\n  }\n\n\n  fragment OrderFragment on Order {\n    id\n    name\n    note\n    canMarkAsPaid\n    canNotifyCustomer\n    cancelReason\n    cancellation {\n      staffNote\n    }\n    cancelledAt\n    capturable\n    cartDiscountAmountSet {\n      ...MoneyBagFragment\n    }\n    closed\n    closedAt\n    confirmationNumber\n    confirmed\n    currencyCode\n    currentCartDiscountAmountSet {\n      ...MoneyBagFragment\n    }\n    currentSubtotalLineItemsQuantity\n    currentSubtotalPriceSet {\n      ...MoneyBagFragment\n    }\n    currentTaxLines {\n      ...TaxLineFragment\n    }\n    customer {\n      ...CustomerFragment\n    }\n    customerLocale\n    discountCode\n    discountCodes\n    displayAddress {\n      ...MailingAddressFragment\n    }\n    displayFinancialStatus\n    displayFulfillmentStatus\n    edited\n    estimatedTaxes\n    fulfillable\n    fullyPaid\n    billingAddress {\n      ...MailingAddressFragment\n    }\n    test\n    unpaid\n    createdAt\n    updatedAt\n  }\n\n\n    query GetWebhookOrder($id: ID!) {\n      order(id: $id) {\n        ...OrderFragment\n      }\n    }': {
    return: GetWebhookOrderQuery;
    variables: GetWebhookOrderQueryVariables;
  };
  '#graphql\n    \n    #graphql\n  fragment ProductFragment on Product {\n    id\n    handle\n    title\n    description\n    descriptionHtml\n    images(first: 50) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    tags\n    status\n    templateSuffix\n    options {\n      id\n      name\n      values\n      position\n    }\n    vendor\n    productType\n    publishedAt\n    createdAt\n    updatedAt\n  }\n\n\n    query GetWebhookProduct($id: ID!) {\n      product(id: $id) {\n        ...ProductFragment\n      }\n    }': {
    return: GetWebhookProductQuery;
    variables: GetWebhookProductQueryVariables;
  };
}

interface GeneratedMutationTypes {}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
