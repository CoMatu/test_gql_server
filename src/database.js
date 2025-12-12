import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, "..", "data");
const chargesPath = join(dataDir, "charges.json");
const pumpsPath = join(dataDir, "pumps.json");
const resourcesPath = join(dataDir, "resources.json");
const complexResourcesPath = join(dataDir, "complexResources.json");
const employeesPath = join(dataDir, "employees.json");
const waybillsPath = join(dataDir, "waybills.json");

// Создаем директорию data если её нет
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Загрузка данных из JSON файлов
function loadData(filePath, defaultValue = []) {
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error(`Ошибка при чтении ${filePath}:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
}

// Сохранение данных в JSON файлы
function saveData(filePath, data) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Ошибка при записи ${filePath}:`, error);
    throw error;
  }
}

// Загружаем данные при инициализации
let charges = loadData(chargesPath, []);
let pumps = loadData(pumpsPath, []);
let resources = loadData(resourcesPath, []);
let complexResources = loadData(complexResourcesPath, []);
let employees = loadData(employeesPath, []);
let waybills = loadData(waybillsPath, []);

// Экспортируем функции для работы с данными
export const db = {
  charges: {
    getAll() {
      return charges.filter((item) => !item.deletedAt);
    },

    getById(id) {
      const item = charges.find((c) => c.id === id && !c.deletedAt);
      return item || null;
    },

    getByFilter(filter = {}) {
      let result = charges.filter((item) => !item.deletedAt);

      if (filter?.in?.ids && filter.in.ids.length > 0) {
        result = result.filter((item) => filter.in.ids.includes(item.id));
      }

      return result;
    },

    create(data) {
      const newItem = { ...data };
      charges.push(newItem);
      saveData(chargesPath, charges);
      return newItem;
    },

    update(id, data) {
      const index = charges.findIndex((c) => c.id === id && !c.deletedAt);
      if (index === -1) {
        return null;
      }

      const now = new Date().toISOString();
      charges[index] = {
        ...charges[index],
        ...data,
        id,
        updatedAt: now,
      };
      saveData(chargesPath, charges);
      return charges[index];
    },

    delete(id) {
      const index = charges.findIndex((c) => c.id === id && !c.deletedAt);
      if (index === -1) {
        return false;
      }

      const now = new Date().toISOString();
      charges[index].deletedAt = now;
      charges[index].updatedAt = now;
      saveData(chargesPath, charges);
      return true;
    },
  },

  pumps: {
    getAll() {
      return pumps.filter((item) => !item.deletedAt);
    },

    getById(id) {
      const item = pumps.find((p) => p.id === id && !p.deletedAt);
      return item || null;
    },

    getByFilter(filter = {}) {
      let result = pumps.filter((item) => !item.deletedAt);

      if (filter?.in?.ids && filter.in.ids.length > 0) {
        result = result.filter((item) => filter.in.ids.includes(item.id));
      }

      return result;
    },

    create(data) {
      const newItem = { ...data };
      pumps.push(newItem);
      saveData(pumpsPath, pumps);
      return newItem;
    },

    update(id, data) {
      const index = pumps.findIndex((p) => p.id === id && !p.deletedAt);
      if (index === -1) {
        return null;
      }

      const now = new Date().toISOString();
      pumps[index] = {
        ...pumps[index],
        ...data,
        id,
        updatedAt: now,
      };
      saveData(pumpsPath, pumps);
      return pumps[index];
    },

    delete(id) {
      const index = pumps.findIndex((p) => p.id === id && !p.deletedAt);
      if (index === -1) {
        return false;
      }

      const now = new Date().toISOString();
      pumps[index].deletedAt = now;
      pumps[index].updatedAt = now;
      saveData(pumpsPath, pumps);
      return true;
    },
  },

  resources: {
    getAll() {
      return resources.filter((item) => !item.deletedAt);
    },

    getById(id) {
      const item = resources.find((r) => r.id === id && !r.deletedAt);
      return item || null;
    },

    getByFilter(filter = {}) {
      let result = resources.filter((item) => !item.deletedAt);

      if (filter?.resourceType) {
        result = result.filter(
          (item) => item.resourceType === filter.resourceType
        );
      }

      if (filter?.garageNumbers && filter.garageNumbers.length > 0) {
        result = result.filter((item) =>
          filter.garageNumbers.includes(item.garageNumber)
        );
      }

      return result;
    },
  },

  complexResources: {
    getAll() {
      return complexResources.filter((item) => !item.deleted);
    },

    getById(id) {
      const item = complexResources.find((cr) => cr.id === id && !cr.deleted);
      return item || null;
    },

    getByFilter(filter = {}) {
      let result = complexResources.filter((item) => !item.deleted);

      if (filter?.deleted !== undefined) {
        result = result.filter((item) => item.deleted === filter.deleted);
      }

      if (filter?.in) {
        if (filter.in.employeeIds && filter.in.employeeIds.length > 0) {
          result = result.filter((item) =>
            filter.in.employeeIds.includes(item.employeeId)
          );
        }
        if (filter.in.resourceIds && filter.in.resourceIds.length > 0) {
          result = result.filter((item) =>
            filter.in.resourceIds.includes(item.resourceId)
          );
        }
        if (filter.in.creationTypes && filter.in.creationTypes.length > 0) {
          result = result.filter((item) =>
            filter.in.creationTypes.includes(item.createType)
          );
        }
        if (filter.in.resourceTypes && filter.in.resourceTypes.length > 0) {
          // Фильтрация по типу ресурса через связанный ресурс
          const resourceIds = resources
            .filter(
              (r) =>
                !r.deletedAt && filter.in.resourceTypes.includes(r.resourceType)
            )
            .map((r) => r.id);
          result = result.filter((item) =>
            resourceIds.includes(item.resourceId)
          );
        }
      }

      if (filter?.notIn) {
        if (filter.notIn.employeeIds && filter.notIn.employeeIds.length > 0) {
          result = result.filter(
            (item) => !filter.notIn.employeeIds.includes(item.employeeId)
          );
        }
        if (filter.notIn.resourceIds && filter.notIn.resourceIds.length > 0) {
          result = result.filter(
            (item) => !filter.notIn.resourceIds.includes(item.resourceId)
          );
        }
      }

      return result;
    },
  },

  employees: {
    getById(id) {
      return employees.find((e) => e.id === id) || null;
    },
    getAll() {
      return employees;
    },
  },

  waybills: {
    getById(id) {
      return waybills.find((w) => w.id === id) || null;
    },
    getAll() {
      return waybills;
    },
  },
};

export default db;
