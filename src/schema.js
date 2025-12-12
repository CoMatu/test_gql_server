// Минимальная GraphQL схема с необходимыми типами и операциями
// Основана на схеме из /Users/matu1/Pulkovo/shared_graphql_schema/lib/src/graphql_generated/schema/schema.gql
const minimalSchema = `
scalar DateTime

type ConsumableMaterialCharge {
  amount: String!
  chargedAt: DateTime!
  consumableMaterialCode: String!
  createdAt: DateTime!
  deletedAt: DateTime
  id: String!
  operatorId: String!
  taskId: String!
  updatedAt: DateTime!
  vehicleId: String!
}

input ConsumableMaterialChargeCreateInput {
  amount: String!
  chargedAt: DateTime!
  consumableMaterialCode: String!
  flightId: String!
  operatorId: String!
  taskId: String!
  vehicleId: String!
}

type ConsumableMaterialChargeError {
  message: String!
}

input ConsumableMaterialChargeFilter {
  in: ConsumableMaterialChargeFilterInInput
}

input ConsumableMaterialChargeFilterInInput {
  ids: [String!]
}

union ConsumableMaterialChargePayload = ConsumableMaterialCharge | ConsumableMaterialChargeError

input ConsumableMaterialChargeUpdateInput {
  amount: String!
  chargedAt: DateTime!
  consumableMaterialCode: String!
  id: String!
  operatorId: String!
  taskId: String!
  vehicleId: String!
}

type ConsumableMaterialPump {
  amount: String!
  amountAfterPump: String!
  amountBeforePump: String!
  consumableMaterialCode: String!
  createdAt: DateTime!
  deletedAt: DateTime
  id: String!
  pumpedAt: DateTime!
  tankNumber: String!
  updatedAt: DateTime!
}

input ConsumableMaterialPumpCreateInput {
  amount: String!
  amountAfterPump: String!
  amountBeforePump: String!
  consumableMaterialCode: String!
  pumpedAt: DateTime!
  tankNumber: String!
}

type ConsumableMaterialPumpError {
  message: String!
}

input ConsumableMaterialPumpFilter {
  in: ConsumableMaterialPumpFilterInInput
}

input ConsumableMaterialPumpFilterInInput {
  ids: [String!]
}

union ConsumableMaterialPumpPayload = ConsumableMaterialPump | ConsumableMaterialPumpError

input ConsumableMaterialPumpUpdateInput {
  amount: String!
  amountAfterPump: String!
  amountBeforePump: String!
  consumableMaterialCode: String!
  id: String!
  pumpedAt: DateTime!
  tankNumber: String!
}

enum ComplexResourceCreationType {
  AUTOMATIC
  MANUAL
  TASK
}

type ComplexResource {
  createType: ComplexResourceCreationType!
  deleted: Boolean!
  deletedAt: DateTime
  employee: Employee!
  id: ID
  name: String!
  resource: ResourceItem!
  validityPeriodFact: OptionalDateTimePeriod!
  validityPeriodPlan: OptionalDateTimePeriod!
  waybill: Waybill
}

type Employee {
  id: ID!
  firstName: String!
  lastName: String!
  middleName: String!
  number: String!
  integrationId: String!
}

type ResourceItem {
  erpId: String
  resource: Resource
  resourceType: ResourceType
}

type Resource {
  id: ID!
  name: String
}

enum ResourceType {
  AirBridge
  AirConditioner
  AirStartDevice
  Tractor
}

type OptionalDateTimePeriod {
  from: DateTime
  to: DateTime
}

input OptionalDateTimePeriodInput {
  from: DateTime
  to: DateTime
}

type Waybill {
  id: ID!
  waybillNum: String!
  eventDateTime: DateTime!
  createdAt: DateTime!
  dateTimeStart: DateTime
  dateTimeEnd: DateTime
  complexResource: ComplexResource
  mobileAsset: ResourceItem!
  personAssigned: Employee
  subdivision: Subdivision
}

type Subdivision {
  id: ID!
  name: String
}

input DateTimeRangeCriteria {
  period: OptionalDateTimePeriodInput
  type: DateTimeRangeCriteriaType!
  value: DateTimeRangeCriteriaValue
}

enum DateTimeRangeCriteriaType {
  AFTER
  COVER
  COVER_FROM_POINT
  COVER_OR_AFTER_FROM_POINT
  COVER_TO_POINT
  INSIDE
  INTERSECTION
}

input DateTimeRangeCriteriaValue {
  offset: DateTimeRangeValueInput
  period: OptionalDateTimePeriodInput
}

input DateTimeRangeValueInput {
  explicitOrNow: DateTime
  from: Duration!
  to: Duration!
}

scalar Duration

input ComplexResourceFilter {
  deleted: Boolean = false
  in: ComplexResourceFilterInInput
  notIn: ComplexResourceFilterInInput
  validityPeriodFact: [DateTimeRangeCriteria!]
  validityPeriodPlan: [DateTimeRangeCriteria!]
}

input ComplexResourceFilterInInput {
  businessRoleIds: [ID!]
  creationTypes: [ComplexResourceCreationType!]
  employeeIds: [ID!]
  resourceIds: [ID!]
  resourceTypes: [ResourceType!]
  subdivisionIds: [ID!]
  waybillIds: [ID!]
}

type Query {
  consumableMaterialCharges(filter: ConsumableMaterialChargeFilter): [ConsumableMaterialCharge!]!
  complexResources(filter: ComplexResourceFilter): [ComplexResource!]!
}

type Mutation {
  createConsumableMaterialCharge(input: ConsumableMaterialChargeCreateInput!): ConsumableMaterialChargePayload!
  updateConsumableMaterialCharge(input: ConsumableMaterialChargeUpdateInput!): ConsumableMaterialChargePayload!
  deleteConsumableMaterialCharge(id: ID!): Boolean!
  createConsumableMaterialPump(input: ConsumableMaterialPumpCreateInput!): ConsumableMaterialPumpPayload!
  updateConsumableMaterialPump(input: ConsumableMaterialPumpUpdateInput!): ConsumableMaterialPumpPayload!
  deleteConsumableMaterialPump(id: ID!): Boolean!
}
`;

export const typeDefs = minimalSchema;
