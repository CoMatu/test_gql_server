import { v4 as uuidv4 } from "uuid";
import { ChargeModel } from "./models/charge.js";
import { PumpModel } from "./models/pump.js";
import { db } from "./database.js";

// Резолвер для скалярного типа DateTime
const DateTime = {
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => ast.value,
};

// Функция для создания резолверов для типов ресурсов
function createResourceResolver(typeName) {
  return {
    id: (parent) => parent.id,
    deletedAt: (parent) => parent.deletedAt || null,
    erpResourceId: (parent) => parent.erpResourceId || null,
    isPartOfComplexResource: (parent) =>
      parent.isPartOfComplexResource ?? false,
    malfunction: (parent) => parent.malfunction ?? false,
    mobileIdent: (parent) => parent.mobileIdent || null,
    mobilityType: (parent) => parent.mobilityType || "Mobile",
    onlineStatus: (parent) => parent.onlineStatus || "OFFLINE",
    productionSiteName: (parent) => parent.productionSiteName || null,
    resourceNumber: (parent) => parent.resourceNumber || "",
    resourceNumberType: (parent) => parent.resourceNumberType || "Garage",
    subdivisionId: (parent) => parent.subdivisionId || "",
    businessRoleNames: (parent) => {
      const roles = parent.businessRoles || [];
      return roles.map((role) => role?.name || "").filter((name) => name);
    },
    businessRoles: (parent) => {
      if (parent.businessRoles) return parent.businessRoles;
      if (parent.businessRoleIds && Array.isArray(parent.businessRoleIds)) {
        return parent.businessRoleIds
          .map((id) => db.businessRoles?.getById?.(id))
          .filter((role) => role !== null && role !== undefined);
      }
      return [];
    },
    businessRolesToResource: (parent) => {
      return [];
    },
    unavailability: (parent) => {
      return [];
    },
    waybills: (parent) => {
      return [];
    },
  };
}

export const resolvers = {
  DateTime,

  Query: {
    consumableMaterialCharges: (parent, args) => {
      try {
        const filter = args.filter || {};
        const charges = ChargeModel.findAll(filter);
        return charges || [];
      } catch (error) {
        console.error("Error in consumableMaterialCharges:", error);
        return [];
      }
    },
    complexResources: (parent, args) => {
      try {
        const filter = args.filter || {};
        return db.complexResources.getByFilter(filter);
      } catch (error) {
        console.error("Error in complexResources:", error);
        return [];
      }
    },
    resources: (parent, args) => {
      try {
        const filter = args.filter || {};
        const employeeFilter = args.employeeFilter || null;
        const resources = db.resources.getByFilter(filter);
        // Обертываем ресурсы в ResourceItem, как требует реальная схема
        return resources.map((resource) => ({
          erpId: null,
          resource: resource,
          resourceType: resource.resourceType,
        }));
      } catch (error) {
        console.error("Error in resources:", error);
        return [];
      }
    },
  },

  Mutation: {
    // Создание заправки
    createConsumableMaterialCharge: (parent, args) => {
      try {
        const { input } = args;
        const id = uuidv4();

        const charge = ChargeModel.create({
          id,
          amount: input.amount,
          chargedAt: input.chargedAt,
          consumableMaterialCode: input.consumableMaterialCode,
          operatorId: input.operatorId,
          taskId: input.taskId,
          vehicleId: input.vehicleId,
        });

        return charge;
      } catch (error) {
        console.error("Error in createConsumableMaterialCharge:", error);
        return {
          __typename: "ConsumableMaterialChargeError",
          message: error.message || "Ошибка при создании заправки",
        };
      }
    },

    // Обновление заправки
    updateConsumableMaterialCharge: (parent, args) => {
      try {
        const { input } = args;

        const charge = ChargeModel.update(input.id, {
          amount: input.amount,
          chargedAt: input.chargedAt,
          consumableMaterialCode: input.consumableMaterialCode,
          operatorId: input.operatorId,
          taskId: input.taskId,
          vehicleId: input.vehicleId,
        });

        if (!charge) {
          return {
            __typename: "ConsumableMaterialChargeError",
            message: `Заправка с id ${input.id} не найдена`,
          };
        }

        return charge;
      } catch (error) {
        console.error("Error in updateConsumableMaterialCharge:", error);
        return {
          __typename: "ConsumableMaterialChargeError",
          message: error.message || "Ошибка при обновлении заправки",
        };
      }
    },

    // Удаление заправки
    deleteConsumableMaterialCharge: (parent, args) => {
      try {
        const { id } = args;
        return ChargeModel.delete(id);
      } catch (error) {
        console.error("Error in deleteConsumableMaterialCharge:", error);
        return false;
      }
    },

    // Создание перекачки
    createConsumableMaterialPump: (parent, args) => {
      try {
        const { input } = args;
        const id = uuidv4();

        const pump = PumpModel.create({
          id,
          amount: input.amount,
          amountAfterPump: input.amountAfterPump,
          amountBeforePump: input.amountBeforePump,
          consumableMaterialCode: input.consumableMaterialCode,
          pumpedAt: input.pumpedAt,
          tankNumber: input.tankNumber,
        });

        return pump;
      } catch (error) {
        console.error("Error in createConsumableMaterialPump:", error);
        return {
          __typename: "ConsumableMaterialPumpError",
          message: error.message || "Ошибка при создании перекачки",
        };
      }
    },

    // Обновление перекачки
    updateConsumableMaterialPump: (parent, args) => {
      try {
        const { input } = args;

        const pump = PumpModel.update(input.id, {
          amount: input.amount,
          amountAfterPump: input.amountAfterPump,
          amountBeforePump: input.amountBeforePump,
          consumableMaterialCode: input.consumableMaterialCode,
          pumpedAt: input.pumpedAt,
          tankNumber: input.tankNumber,
        });

        if (!pump) {
          return {
            __typename: "ConsumableMaterialPumpError",
            message: `Перекачка с id ${input.id} не найдена`,
          };
        }

        return pump;
      } catch (error) {
        console.error("Error in updateConsumableMaterialPump:", error);
        return {
          __typename: "ConsumableMaterialPumpError",
          message: error.message || "Ошибка при обновлении перекачки",
        };
      }
    },

    // Удаление перекачки
    deleteConsumableMaterialPump: (parent, args) => {
      try {
        const { id } = args;
        return PumpModel.delete(id);
      } catch (error) {
        console.error("Error in deleteConsumableMaterialPump:", error);
        return false;
      }
    },
  },

  // Резолверы для union типов
  ConsumableMaterialChargePayload: {
    __resolveType(obj) {
      if (obj.__typename) {
        return obj.__typename;
      }
      if (obj.message) {
        return "ConsumableMaterialChargeError";
      }
      return "ConsumableMaterialCharge";
    },
  },

  ConsumableMaterialPumpPayload: {
    __resolveType(obj) {
      if (obj.__typename) {
        return obj.__typename;
      }
      if (obj.message) {
        return "ConsumableMaterialPumpError";
      }
      return "ConsumableMaterialPump";
    },
  },

  // Резолверы для ComplexResource и связанных типов
  ComplexResource: {
    employee: (parent) => {
      if (parent.employee) return parent.employee;
      if (parent.employeeId) {
        return db.employees.getById(parent.employeeId);
      }
      return null;
    },
    resource: (parent) => {
      if (parent.resource) return parent.resource;
      if (parent.resourceId) {
        const resource = db.resources.getById(parent.resourceId);
        if (resource) {
          return {
            erpId: null,
            resource: resource,
            resourceType: resource.resourceType,
          };
        }
      }
      return null;
    },
    waybill: (parent) => {
      if (parent.waybill) return parent.waybill;
      if (parent.waybillId) {
        const waybill = db.waybills.getById(parent.waybillId);
        if (waybill) {
          // Резолвим связанные данные для waybill
          const mobileAsset = db.resources.getById(
            waybill.mobileAssetResourceId
          );
          const personAssigned = db.employees.getById(waybill.personAssignedId);
          return {
            ...waybill,
            mobileAsset: mobileAsset
              ? {
                  erpId: null,
                  resource: mobileAsset,
                  resourceType: mobileAsset.resourceType,
                }
              : null,
            personAssigned: personAssigned,
          };
        }
      }
      return null;
    },
    shortTitle: (parent) => parent.shortTitle || null,
    resourceNumber: (parent) => parent.resourceNumber || "",
    validityPeriodFact: (parent) =>
      parent.validityPeriodFact || { from: null, to: null },
    validityPeriodPlan: (parent) =>
      parent.validityPeriodPlan || { from: null, to: null },
  },

  Employee: {
    id: (parent) => parent.id || "unknown-employee-id",
    number: (parent) => parent.number || "",
    deletedAt: (parent) => parent.deletedAt || null,
    erpResourceId: (parent) => parent.erpResourceId || null,
    firstName: (parent) => parent.firstName || "",
    integrationId: (parent) => parent.integrationId || "",
    isPartOfComplexResource: (parent) =>
      parent.isPartOfComplexResource ?? false,
    lastName: (parent) => parent.lastName || "",
    malfunction: (parent) => parent.malfunction ?? false,
    middleName: (parent) => parent.middleName || "",
    mobileIdent: (parent) => parent.mobileIdent || null,
    resourceNumber: (parent) => parent.resourceNumber || "",
    shiftFilterProfileId: (parent) => parent.shiftFilterProfileId || null,
    shortTitle: (parent) => parent.shortTitle || null,
    subdivisionId: (parent) => parent.subdivisionId || "",
    taskFilterProfileId: (parent) => parent.taskFilterProfileId || null,
    availability: (parent, args) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    availableBusinessRoles: (parent) => {
      // Возвращаем businessRoles для упрощения
      return parent.businessRoles || [];
    },
    availableResourceTypes: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    availableServiceStandards: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    availableSubdivisions: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    businessRole: (parent) => {
      // Deprecated, возвращаем первый businessRole
      const roles = parent.businessRoles || [];
      return roles.length > 0 ? roles[0] : null;
    },
    businessRoleNames: (parent) => {
      const roles = parent.businessRoles || [];
      return roles.map((role) => role?.name || "").filter((name) => name);
    },
    businessRoles: (parent) => {
      if (parent.businessRoles) return parent.businessRoles;
      if (parent.businessRoleIds && Array.isArray(parent.businessRoleIds)) {
        return parent.businessRoleIds
          .map((id) => db.businessRoles?.getById?.(id))
          .filter((role) => role !== null && role !== undefined);
      }
      return [];
    },
    businessRolesToResource: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    currentShiftStatus: (parent) => {
      return parent.currentShiftStatus || "NOT_ON_SHIFT";
    },
    employeeGroupViews: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    mobilityType: (parent) => {
      return parent.mobilityType || "Mobile";
    },
    onlineStatus: (parent) => {
      return parent.onlineStatus || "OFFLINE";
    },
    position: (parent) => {
      if (parent.position) return parent.position;
      if (parent.positionId) {
        const position = db.positions?.getById?.(parent.positionId);
        if (position) return position;
      }
      // Возвращаем дефолтный объект Position, если поле обязательное
      return {
        id: "default-position",
        code: "",
        deletedAt: null,
        integrationId: "",
        name: null,
        uniqueCode: "",
        validityPeriod: { from: null, to: null },
      };
    },
    previousShifts: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    productionSiteName: (parent) => parent.productionSiteName || null,
    resourceGroup: (parent) => parent.resourceGroup || null,
    resourceGroupDisplayConfig: (parent) => {
      return parent.resourceGroupDisplayConfig || "EMPLOYEE_TECH";
    },
    resourceGroupValidityPeriods: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    resourceNumberType: (parent) => {
      return parent.resourceNumberType || "Garage";
    },
    shiftJournals: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    shifts: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    skillData: (parent) => {
      return {
        skillSpecificationCodes: parent.skillSpecificationCodes || [],
        skillSpecificationNames: parent.skillSpecificationNames || [],
        skills: parent.skills || [],
      };
    },
    skillSpecificationCodes: (parent) => {
      return parent.skillSpecificationCodes || [];
    },
    skillSpecificationNames: (parent) => {
      return parent.skillSpecificationNames || [];
    },
    skills: (parent) => {
      return parent.skills || [];
    },
    subdivision: (parent) => {
      if (parent.subdivision) return parent.subdivision;
      if (parent.subdivisionId) {
        const subdivision = db.subdivisions?.getById?.(parent.subdivisionId);
        if (subdivision) return subdivision;
      }
      // Возвращаем дефолтный объект Subdivision, если поле обязательное
      return {
        id: "default-subdivision",
        hrmId: "",
        integrationId: "",
        name: "",
        deletedAt: null,
        validityPeriod: { from: null, to: null },
      };
    },
    subdivisionTrip: (parent) => {
      if (parent.subdivisionTrip) return parent.subdivisionTrip;
      if (parent.subdivisionTripId) {
        return db.subdivisions?.getById?.(parent.subdivisionTripId) || null;
      }
      return null;
    },
    unavailability: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    uniquePositionCode: (parent) => {
      const position =
        parent.position ||
        (parent.positionId ? db.positions?.getById?.(parent.positionId) : null);
      const subdivision =
        parent.subdivision ||
        (parent.subdivisionId
          ? db.subdivisions?.getById?.(parent.subdivisionId)
          : null);
      if (position && subdivision) {
        return `${subdivision.hrmId}_${position.code}`;
      }
      return "";
    },
    validityPeriod: (parent) => {
      return parent.validityPeriod || { from: null, to: null };
    },
    waybills: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
  },

  Position: {
    code: (parent) => parent.code || "",
    deletedAt: (parent) => parent.deletedAt || null,
    id: (parent) => parent.id,
    integrationId: (parent) => parent.integrationId || "",
    name: (parent) => parent.name || null,
    subdivision: (parent) => {
      // Deprecated, возвращаем null
      return null;
    },
    subdivisions: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    uniqueCode: (parent) => parent.uniqueCode || "",
    validityPeriod: (parent) => {
      return parent.validityPeriod || { from: null, to: null };
    },
  },

  BusinessRole: {
    deleted: (parent) => parent.deleted ?? false,
    deletedAt: (parent) => parent.deletedAt || null,
    description: (parent) => parent.description || null,
    fileRecord: (parent) => parent.fileRecord || null,
    id: (parent) => parent.id,
    name: (parent) => parent.name || "",
    resourceTypes: (parent) => {
      return parent.resourceTypes || [];
    },
    subdivisions: (parent) => {
      if (parent.subdivisions) return parent.subdivisions;
      if (parent.subdivisionIds && Array.isArray(parent.subdivisionIds)) {
        return parent.subdivisionIds
          .map((id) => db.subdivisions?.getById?.(id))
          .filter((sub) => sub !== null && sub !== undefined);
      }
      return [];
    },
  },

  ResourceItem: {
    erpId: (parent) => parent.erpId || null,
    resource: (parent) => {
      if (parent.resource) return parent.resource;
      // Если resource уже объект Resource, возвращаем его
      if (parent.resource && typeof parent.resource === "object") {
        return parent.resource;
      }
      return null;
    },
    resourceType: (parent) => {
      if (parent.resourceType) return parent.resourceType;
      if (parent.resource && parent.resource.resourceType) {
        return parent.resource.resourceType;
      }
      return null;
    },
  },

  Resource: {
    __resolveType(obj) {
      // Определяем тип на основе resourceType или __typename
      if (obj.__typename) {
        return obj.__typename;
      }
      if (obj.resourceType) {
        // Маппинг ResourceType enum на типы
        const typeMap = {
          AirBridge: "AirBridge",
          AirConditioner: "AirConditioner",
          AirStartDevice: "AirStartDevice",
          AircraftTug: "AircraftTug",
          Ambulift: "Ambulift",
          BaggageTractor: "BaggageTractor",
          BeltLoader: "BeltLoader",
          Car: "Car",
          ContainerLoader: "ContainerLoader",
          DeicingCar: "DeicingCar",
          Extinguisher: "Extinguisher",
          GPU: "GPU",
          GasRefueller: "GasRefueller",
          Heater: "Heater",
          HeaterCar: "HeaterCar",
          PaxBus: "PaxBus",
          PaxStairs: "PaxStairs",
          Stepladder: "Stepladder",
          Towbar: "Towbar",
          TowbarAdapter: "TowbarAdapter",
          Tractor: "Tractor",
          VacuumCleaner: "VacuumCleaner",
          VacuumSweeper: "VacuumSweeper",
          VipServiceCar: "VipServiceCar",
          WasteDisposalMachine: "WasteDisposalMachine",
          WaterCar: "WaterCar",
        };
        return typeMap[obj.resourceType] || "Car"; // По умолчанию Car
      }
      // Если это Employee (имеет firstName, lastName и т.д.)
      if (obj.firstName || obj.lastName) {
        return "Employee";
      }
      // По умолчанию возвращаем Car
      return "Car";
    },
  },

  // Базовый резолвер для всех типов ресурсов через IResource
  IResource: {
    __resolveType(obj) {
      return resolvers.Resource.__resolveType(obj);
    },
  },

  // Резолверы для всех типов ресурсов (используют общую логику)
  AirBridge: createResourceResolver("AirBridge"),
  AirConditioner: createResourceResolver("AirConditioner"),
  AirStartDevice: createResourceResolver("AirStartDevice"),
  AircraftTug: createResourceResolver("AircraftTug"),
  Ambulift: createResourceResolver("Ambulift"),
  BaggageTractor: createResourceResolver("BaggageTractor"),
  BeltLoader: createResourceResolver("BeltLoader"),
  Car: createResourceResolver("Car"),
  ContainerLoader: createResourceResolver("ContainerLoader"),
  DeicingCar: createResourceResolver("DeicingCar"),
  Extinguisher: createResourceResolver("Extinguisher"),
  GPU: createResourceResolver("GPU"),
  GasRefueller: createResourceResolver("GasRefueller"),
  Heater: createResourceResolver("Heater"),
  HeaterCar: createResourceResolver("HeaterCar"),
  PaxBus: createResourceResolver("PaxBus"),
  PaxStairs: createResourceResolver("PaxStairs"),
  Stepladder: createResourceResolver("Stepladder"),
  Towbar: createResourceResolver("Towbar"),
  TowbarAdapter: createResourceResolver("TowbarAdapter"),
  VacuumCleaner: createResourceResolver("VacuumCleaner"),
  VacuumSweeper: createResourceResolver("VacuumSweeper"),
  VipServiceCar: createResourceResolver("VipServiceCar"),
  WasteDisposalMachine: createResourceResolver("WasteDisposalMachine"),
  WaterCar: createResourceResolver("WaterCar"),

  OptionalDateTimePeriod: {
    from: (parent) => parent.from || null,
    to: (parent) => parent.to || null,
  },

  Waybill: {
    id: (parent) => parent.id,
    waybillNum: (parent) => parent.waybillNum || "",
    eventDateTime: (parent) => parent.eventDateTime,
    createdAt: (parent) => parent.createdAt,
    dateTimeStart: (parent) => parent.dateTimeStart || null,
    dateTimeEnd: (parent) => parent.dateTimeEnd || null,
    complexResource: (parent) => parent.complexResource || null,
    mobileAsset: (parent) => {
      if (parent.mobileAsset) return parent.mobileAsset;
      if (parent.mobileAssetResourceId) {
        const resource = db.resources.getById(parent.mobileAssetResourceId);
        if (resource) {
          return {
            erpId: null,
            resource: resource,
            resourceType: resource.resourceType,
          };
        }
      }
      return null;
    },
    personAssigned: (parent) => {
      if (parent.personAssigned) return parent.personAssigned;
      if (parent.personAssignedId) {
        return db.employees.getById(parent.personAssignedId);
      }
      return null;
    },
    subdivision: (parent) => parent.subdivision || null,
  },

  Subdivision: {
    deletedAt: (parent) => parent.deletedAt || null,
    hrmId: (parent) => parent.hrmId || "",
    id: (parent) => parent.id,
    integrationId: (parent) => parent.integrationId || "",
    name: (parent) => parent.name || "",
    positions: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
    validityPeriod: (parent) => {
      return parent.validityPeriod || { from: null, to: null };
    },
  },

  Duration: {
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => ast.value,
  },

  // Резолверы для новых типов Employee
  EmployeeAvailability: {
    availableFrom: (parent) => parent.availableFrom,
    availableTo: (parent) => parent.availableTo,
    isArrived: (parent) => parent.isArrived ?? false,
  },

  BusinessRoleToResource: {
    businessRole: (parent) => {
      if (parent.businessRole) return parent.businessRole;
      if (parent.businessRoleId) {
        return db.businessRoles?.getById?.(parent.businessRoleId) || null;
      }
      return null;
    },
    id: (parent) => parent.id,
    resourceId: (parent) => parent.resourceId || "",
    validFrom: (parent) => parent.validFrom || null,
    validTo: (parent) => parent.validTo || null,
  },

  EmployeeGroupView: {
    deletable: (parent) => parent.deletable ?? false,
    employeeGroup: (parent) => {
      if (parent.employeeGroup) return parent.employeeGroup;
      if (parent.employeeGroupId) {
        return db.employeeGroups?.getById?.(parent.employeeGroupId) || null;
      }
      return null;
    },
    id: (parent) => parent.id,
    validityPeriod: (parent) => {
      return parent.validityPeriod || { from: null, to: null };
    },
  },

  EmployeeGroup: {
    businessRoles: (parent) => {
      if (parent.businessRoles) return parent.businessRoles;
      if (parent.businessRoleIds && Array.isArray(parent.businessRoleIds)) {
        return parent.businessRoleIds
          .map((id) => db.businessRoles?.getById?.(id))
          .filter((role) => role !== null && role !== undefined);
      }
      return [];
    },
    deleted: (parent) => parent.deleted ?? false,
    deletedAt: (parent) => parent.deletedAt || null,
    id: (parent) => parent.id,
    name: (parent) => parent.name || "",
    subdivisions: (parent) => {
      if (parent.subdivisions) return parent.subdivisions;
      if (parent.subdivisionIds && Array.isArray(parent.subdivisionIds)) {
        return parent.subdivisionIds
          .map((id) => db.subdivisions?.getById?.(id))
          .filter((sub) => sub !== null && sub !== undefined);
      }
      return [];
    },
    validityPeriods: (parent) => {
      // Возвращаем пустой массив для тестовой реализации
      return [];
    },
  },

  EmployeeGroupValidityPeriod: {
    employeeGroup: (parent) => parent.employeeGroup,
    employees: (parent) => parent.employees || [],
    validityPeriod: (parent) => {
      return parent.validityPeriod || { from: null, to: null };
    },
  },

  ResourceGroup: {
    id: (parent) => parent.id,
    name: (parent) => parent.name || null,
  },

  ResourceGroupValidityPeriod: {
    id: (parent) => parent.id,
    period: (parent) => {
      return parent.period || parent.validityPeriod || { from: null, to: null };
    },
    resourceGroup: (parent) => parent.resourceGroup,
    resources: (parent) => parent.resources || [],
    summaryTask: (parent) => parent.summaryTask || null,
  },

  ShiftJournal: {
    arrivalDate: (parent) => parent.arrivalDate || null,
    complexResources: (parent, args) => {
      const filter = args.complexResourceFilter || {};
      return db.complexResources.getByFilter(filter);
    },
    currentShiftStatus: (parent) => {
      return parent.currentShiftStatus || "NOT_ON_SHIFT";
    },
  },

  Shift: {
    id: (parent) => parent.id,
  },

  EmployeeSkillData: {
    skillSpecificationCodes: (parent) => parent.skillSpecificationCodes || [],
    skillSpecificationNames: (parent) => parent.skillSpecificationNames || [],
    skills: (parent) => parent.skills || [],
  },

  Skill: {
    employee: (parent) => {
      if (parent.employee) return parent.employee;
      if (parent.employeeId) {
        return db.employees.getById(parent.employeeId);
      }
      return null;
    },
    skillSpecification: (parent) => {
      if (parent.skillSpecification) return parent.skillSpecification;
      if (parent.skillSpecificationId) {
        return (
          db.skillSpecifications?.getById?.(parent.skillSpecificationId) || null
        );
      }
      return null;
    },
    validFrom: (parent) => parent.validFrom || null,
    validTo: (parent) => parent.validTo || null,
  },

  ResourceUnavailabilityPeriod: {
    acceptedAt: (parent) => parent.acceptedAt || null,
    comment: (parent) => parent.comment || null,
    complexResourceId: (parent) => parent.complexResourceId || null,
    createdBy: (parent) => parent.createdBy || "MANUAL",
    deletedAt: (parent) => parent.deletedAt || null,
    id: (parent) => parent.id,
    publishedAt: (parent) => parent.publishedAt || null,
    resourceType: (parent) => parent.resourceType || "Car",
    status: (parent) => parent.status || null,
    transitions: (parent) => parent.transitions || [],
    type: (parent) => parent.type || "PRODUCTION",
    unavailableFrom: (parent) => parent.unavailableFrom || parent.from || null,
    unavailableTo: (parent) => parent.unavailableTo || parent.to || null,
    wayBillNum: (parent) => parent.wayBillNum || null,
  },

  ServiceStandard: {
    id: (parent) => parent.id,
    name: (parent) => parent.name || null,
  },

  FileRecord: {
    id: (parent) => parent.id || null,
    comment: (parent) => parent.comment || null,
    fileExtension: (parent) => parent.fileExtension || null,
  },
};
