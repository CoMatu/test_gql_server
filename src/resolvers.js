import { v4 as uuidv4 } from 'uuid';
import { ChargeModel } from './models/charge.js';
import { PumpModel } from './models/pump.js';

// Резолвер для скалярного типа DateTime
const DateTime = {
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => ast.value
};

export const resolvers = {
  DateTime,

  Query: {
    consumableMaterialCharges: (parent, args) => {
      try {
        const filter = args.filter || {};
        const charges = ChargeModel.findAll(filter);
        return charges || [];
      } catch (error) {
        console.error('Error in consumableMaterialCharges:', error);
        return [];
      }
    },
    complexResources: (parent, args) => {
      try {
        const filter = args.filter || {};
        // Для тестового сервера возвращаем пустой массив
        // В реальной реализации здесь должна быть логика фильтрации
        return [];
      } catch (error) {
        console.error('Error in complexResources:', error);
        return [];
      }
    }
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
          vehicleId: input.vehicleId
        });

        return charge;
      } catch (error) {
        console.error('Error in createConsumableMaterialCharge:', error);
        return {
          __typename: 'ConsumableMaterialChargeError',
          message: error.message || 'Ошибка при создании заправки'
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
          vehicleId: input.vehicleId
        });

        if (!charge) {
          return {
            __typename: 'ConsumableMaterialChargeError',
            message: `Заправка с id ${input.id} не найдена`
          };
        }

        return charge;
      } catch (error) {
        console.error('Error in updateConsumableMaterialCharge:', error);
        return {
          __typename: 'ConsumableMaterialChargeError',
          message: error.message || 'Ошибка при обновлении заправки'
        };
      }
    },

    // Удаление заправки
    deleteConsumableMaterialCharge: (parent, args) => {
      try {
        const { id } = args;
        return ChargeModel.delete(id);
      } catch (error) {
        console.error('Error in deleteConsumableMaterialCharge:', error);
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
          tankNumber: input.tankNumber
        });

        return pump;
      } catch (error) {
        console.error('Error in createConsumableMaterialPump:', error);
        return {
          __typename: 'ConsumableMaterialPumpError',
          message: error.message || 'Ошибка при создании перекачки'
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
          tankNumber: input.tankNumber
        });

        if (!pump) {
          return {
            __typename: 'ConsumableMaterialPumpError',
            message: `Перекачка с id ${input.id} не найдена`
          };
        }

        return pump;
      } catch (error) {
        console.error('Error in updateConsumableMaterialPump:', error);
        return {
          __typename: 'ConsumableMaterialPumpError',
          message: error.message || 'Ошибка при обновлении перекачки'
        };
      }
    },

    // Удаление перекачки
    deleteConsumableMaterialPump: (parent, args) => {
      try {
        const { id } = args;
        return PumpModel.delete(id);
      } catch (error) {
        console.error('Error in deleteConsumableMaterialPump:', error);
        return false;
      }
    }
  },

  // Резолверы для union типов
  ConsumableMaterialChargePayload: {
    __resolveType(obj) {
      if (obj.__typename) {
        return obj.__typename;
      }
      if (obj.message) {
        return 'ConsumableMaterialChargeError';
      }
      return 'ConsumableMaterialCharge';
    }
  },

  ConsumableMaterialPumpPayload: {
    __resolveType(obj) {
      if (obj.__typename) {
        return obj.__typename;
      }
      if (obj.message) {
        return 'ConsumableMaterialPumpError';
      }
      return 'ConsumableMaterialPump';
    }
  },

  // Резолверы для ComplexResource и связанных типов
  ComplexResource: {
    employee: (parent) => parent.employee || null,
    resource: (parent) => parent.resource || null,
    waybill: (parent) => parent.waybill || null,
    validityPeriodFact: (parent) => parent.validityPeriodFact || { from: null, to: null },
    validityPeriodPlan: (parent) => parent.validityPeriodPlan || { from: null, to: null }
  },

  Employee: {
    id: (parent) => parent.id,
    firstName: (parent) => parent.firstName || '',
    lastName: (parent) => parent.lastName || '',
    middleName: (parent) => parent.middleName || '',
    number: (parent) => parent.number || '',
    integrationId: (parent) => parent.integrationId || ''
  },

  ResourceItem: {
    erpId: (parent) => parent.erpId || null,
    resource: (parent) => parent.resource || null,
    resourceType: (parent) => parent.resourceType || null
  },

  Resource: {
    id: (parent) => parent.id,
    name: (parent) => parent.name || null
  },

  OptionalDateTimePeriod: {
    from: (parent) => parent.from || null,
    to: (parent) => parent.to || null
  },

  Waybill: {
    id: (parent) => parent.id,
    waybillNum: (parent) => parent.waybillNum || '',
    eventDateTime: (parent) => parent.eventDateTime,
    createdAt: (parent) => parent.createdAt,
    dateTimeStart: (parent) => parent.dateTimeStart || null,
    dateTimeEnd: (parent) => parent.dateTimeEnd || null,
    complexResource: (parent) => parent.complexResource || null,
    mobileAsset: (parent) => parent.mobileAsset || null,
    personAssigned: (parent) => parent.personAssigned || null,
    subdivision: (parent) => parent.subdivision || null
  },

  Subdivision: {
    id: (parent) => parent.id,
    name: (parent) => parent.name || null
  },

  Duration: {
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => ast.value
  }
};

