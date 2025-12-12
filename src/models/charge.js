import db from '../database.js';

export const ChargeModel = {
  // Создание новой заправки
  create(data) {
    const now = new Date().toISOString();
    const chargeData = {
      id: data.id,
      amount: data.amount,
      chargedAt: data.chargedAt,
      consumableMaterialCode: data.consumableMaterialCode,
      operatorId: data.operatorId,
      taskId: data.taskId,
      vehicleId: data.vehicleId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    
    return db.charges.create(chargeData);
  },

  // Поиск по ID
  findById(id) {
    return db.charges.getById(id);
  },

  // Поиск всех (с фильтрацией)
  findAll(filter = {}) {
    return db.charges.getByFilter(filter);
  },

  // Обновление заправки
  update(id, data) {
    return db.charges.update(id, data);
  },

  // Soft delete
  delete(id) {
    return db.charges.delete(id);
  }
};
