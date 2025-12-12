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

enum EmployeeShiftStatus {
  """не на смене"""
  NOT_ON_SHIFT
  """на смене"""
  ON_SHIFT
}

enum MobilityType {
  """Мобильный"""
  Mobile
  """Стационарный"""
  Stationary
}

enum OnlineStatus {
  OFFLINE
  ONLINE
}

enum ResourceNumberType {
  Garage
  Inventory
}

enum EmployeeResourceGroupDisplayConfig {
  EMPLOYEE
  EMPLOYEE_TECH
  TECH
}

type EmployeeAvailability {
  availableFrom: DateTime!
  availableTo: DateTime!
  isArrived: Boolean!
}

input EmployeeAvailabilityFilter {
  availableFrom: DateTime!
  availableTo: DateTime!
}

type BusinessRoleToResource {
  businessRole: BusinessRole!
  id: ID!
  resourceId: ID!
  validFrom: DateTime
  validTo: DateTime
}

input BusinessRoleToResourceFilter {
  in: BusinessRoleToResourceFilterIn
}

input BusinessRoleToResourceFilterIn {
  businessRoleIds: [ID!]
  valid: ValidFilter
}

input ValidFilter {
  at: DateTime
}

input ValidNamesFilter {
  resourceTypes: [ResourceType!]
}

type EmployeeGroupView {
  deletable: Boolean!
  employeeGroup: EmployeeGroup
  id: ID!
  validityPeriod: OptionalDateTimePeriod!
}

type EmployeeGroup {
  businessRoles: [BusinessRole!]!
  deleted: Boolean!
  deletedAt: DateTime
  id: ID
  """required"""
  name: String!
  subdivisions: [Subdivision!]!
  validityPeriods(filter: EmployeeGroupValidityPeriodFilter): [EmployeeGroupValidityPeriod!]!
}

input EmployeeGroupValidityPeriodFilter {
  validityPeriodCriteria: [DateTimeRangeCriteria!]
}

type EmployeeGroupValidityPeriod {
  employeeGroup: EmployeeGroup!
  employees: [Employee!]!
  validityPeriod: OptionalDateTimePeriod!
}

type ResourceGroup {
  id: ID!
  name: String
}

input ResourceGroupValidityPeriodFilter {
  validityPeriodCriteria: [DateTimeRangeCriteria!]
}

type ResourceGroupValidityPeriod {
  resourceGroup: ResourceGroup!
  validityPeriod: OptionalDateTimePeriod!
}

input ShiftJournalFilter {
  id: ID
}

type ShiftJournal {
  id: ID!
  currentShiftStatus: EmployeeShiftStatus!
}

input ShiftFilter {
  id: ID
}

type Shift {
  id: ID!
}

input PreviousShiftsFilter {
  limit: String!
  queryFrom: DateTime!
}

type EmployeeSkillData {
  skillSpecificationCodes: [String!]!
  skillSpecificationNames: [String]!
  skills: [Skill!]!
}

input EmployeeSkillDataFilter {
  skillSpecificationCodes: [String!]
}

type Skill {
  id: ID!
  name: String
}

type ResourceUnavailabilityPeriod {
  from: DateTime!
  to: DateTime!
}

input ResourceUnavailabilityFilter {
  validityPeriodCriteria: [DateTimeRangeCriteria!]
}

input WaybillFilter {
  id: ID
}

input ServiceStandardFilter {
  id: ID
}

type ServiceStandard {
  id: ID!
  name: String
}

type FileRecord {
  id: ID!
  name: String
}

input SubdivisionFilter {
  deleted: Boolean = false
  in: SubdivisionFilterInInput
  notIn: SubdivisionFilterInInput
  validityPeriodCriteria: [DateTimeRangeCriteria!]
}

input SubdivisionFilterInInput {
  hrmId: [String!]
  integrationId: [String!]
  name: [String!]
}

input PositionFilter {
  code: String
  deleted: Boolean = false
  in: PositionFilterInInput
  name: String
  notIn: PositionFilterInInput
  subdivisionHrmId: String
  validityPeriodCriteria: [DateTimeRangeCriteria!]
}

input PositionFilterInInput {
  integrationId: [String!]
  subdivisionId: [ID!]
}

type Employee {
  number: String!
  deletedAt: DateTime
  erpResourceId: String @deprecated(reason: "Deprecated in a favour of ErpResource.resource")
  firstName: String!
  id: ID!
  integrationId: String!
  isPartOfComplexResource: Boolean!
  lastName: String!
  """Недоступность (неисправность) сотрудника, как ресурса"""
  malfunction: Boolean!
  middleName: String!
  mobileIdent: String
  resourceNumber: String!
  shiftFilterProfileId: ID
  shortTitle: String
  subdivisionId: String!
  taskFilterProfileId: ID
  """
  Периоды доступности сотрудника. Формируются из смен, время которых пересекается с временами из фильтра
  """
  availability(filter: EmployeeAvailabilityFilter!): [EmployeeAvailability!]!
  """
  @deprecated(reason: "Deprecated in a favour of User.xxxFilterProfile")
  """
  availableBusinessRoles: [BusinessRole!]!
  availableResourceTypes: [ResourceType!]!
  """
  @deprecated(reason: "Deprecated in a favour of User.xxxFilterProfile")
  """
  availableServiceStandards(filter: ServiceStandardFilter): [ServiceStandard!]!
  """
  @deprecated(reason: "Deprecated in a favour of User.xxxFilterProfile")
  """
  availableSubdivisions: [Subdivision!]!
  """@deprecated(reason: "Will be removed. Use field subdivison")"""
  businessRole: BusinessRole @deprecated(reason: "Deprecated in a favour of businessRoles")
  businessRoleNames(filter: ValidNamesFilter): [String!]!
  businessRoles: [BusinessRole!]!
  businessRolesToResource(filter: BusinessRoleToResourceFilter): [BusinessRoleToResource!]!
  """Статус сотрудника на текущую смену в момент получения данных"""
  currentShiftStatus: EmployeeShiftStatus!
  employeeGroupViews(filter: OptionalDateTimePeriodInput): [EmployeeGroupView!]!
  mobilityType: MobilityType!
  onlineStatus: OnlineStatus!
  """Должность"""
  position: Position!
  previousShifts(filter: PreviousShiftsFilter!): [Shift!]
  """
  @deprecated(reason: "Will be removed. Use skillData.skillSpecificationNames")
  """
  productionSiteName: String
  resourceGroup: ResourceGroup @deprecated
  resourceGroupDisplayConfig: EmployeeResourceGroupDisplayConfig!
  resourceGroupValidityPeriods(filter: ResourceGroupValidityPeriodFilter): [ResourceGroupValidityPeriod!]!
  resourceNumberType: ResourceNumberType!
  shiftJournals(filter: ShiftJournalFilter): [ShiftJournal!]!
  """
  @deprecated(reason: "Will be removed. Use ShiftJournal.currentShiftStatus")
  """
  shifts(filter: ShiftFilter): [Shift!]!
  skillData(filter: EmployeeSkillDataFilter): EmployeeSkillData!
  """@deprecated(reason: "Will be removed. Use skillData.skills")"""
  skillSpecificationCodes: [String!]!
  """
  @deprecated(reason: "Will be removed. Use skillData.skillSpecificationCodes")
  """
  skillSpecificationNames: [String]!
  skills: [Skill!]!
  """Подразделение"""
  subdivision: Subdivision!
  subdivisionTrip: Subdivision
  unavailability(filter: ResourceUnavailabilityFilter): [ResourceUnavailabilityPeriod!]!
  """Уникальный код должности сотрудника: 'Subdivision.hrmId_Position.code'"""
  uniquePositionCode: String!
  validityPeriod: OptionalDateTimePeriod!
  waybills(filter: WaybillFilter): [Waybill!]!
}

type Position {
  """Код должности"""
  code: String!
  deletedAt: DateTime
  """Идентификатор"""
  id: ID!
  """Интеграционный id"""
  integrationId: String!
  """Наименование"""
  name: String
  """Подразделение"""
  subdivision: Subdivision @deprecated(reason: "Changed relation to ManyToMany, field will be removed")
  """@deprecated(reason: "Added to Employee, field will be removed")"""
  subdivisions(filter: SubdivisionFilter): [Subdivision!]!
  """Уникальный код должности"""
  uniqueCode: String!
  validityPeriod: OptionalDateTimePeriod!
}

type BusinessRole {
  deleted: Boolean!
  deletedAt: DateTime
  description: String
  fileRecord: FileRecord
  id: ID!
  name: String!
  resourceTypes: [ResourceType!]!
  subdivisions: [Subdivision!]!
}

type ResourceItem {
  erpId: String
  resource: Resource
  resourceType: ResourceType
}

type Resource {
  id: ID!
  name: String
  garageNumber: String
  resourceType: ResourceType
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime
}

input ResourceFilter {
  resourceType: ResourceType
  garageNumbers: [String!]
}

enum ResourceType {
  AirBridge
  AirConditioner
  AirStartDevice
  AircraftTug
  Ambulift
  BaggageTractor
  BeltLoader
  Car
  ContainerLoader
  DeicingCar
  Extinguisher
  GasRefueller
  GPU
  Heater
  HeaterCar
  PaxBus
  PaxStairs
  Stepladder
  Towbar
  TowbarAdapter
  Tractor
  VacuumCleaner
  VacuumSweeper
  VipServiceCar
  WasteDisposalMachine
  WaterCar
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
  deletedAt: DateTime
  hrmId: String!
  id: ID!
  integrationId: String!
  name: String!
  positions(filter: PositionFilter): [Position!]!
  validityPeriod: OptionalDateTimePeriod!
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
  resources(filter: ResourceFilter): [Resource!]!
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
