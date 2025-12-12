import db from '../database.js';

export const PumpModel = {
  // Создание новой перекачки
  create(data) {
    const now = new Date().toISOString();
    const pumpData = {
      id: data.id,
      amount: data.amount,
      amountAfterPump: data.amountAfterPump,
      amountBeforePump: data.amountBeforePump,
      consumableMaterialCode: data.consumableMaterialCode,
      pumpedAt: data.pumpedAt,
      tankNumber: data.tankNumber,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    
    return db.pumps.create(pumpData);
  },

  // Поиск по ID
  findById(id) {
    return db.pumps.getById(id);
  },

  // Поиск всех (с фильтрацией)
  findAll(filter = {}) {
    return db.pumps.getByFilter(filter);
  },

  // Обновление перекачки
  update(id, data) {
    return db.pumps.update(id, data);
  },

  // Soft delete
  delete(id) {
    return db.pumps.delete(id);
  }
};
