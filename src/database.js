import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '..', 'data');
const chargesPath = join(dataDir, 'charges.json');
const pumpsPath = join(dataDir, 'pumps.json');

// Создаем директорию data если её нет
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Загрузка данных из JSON файлов
function loadData(filePath, defaultValue = []) {
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, 'utf-8');
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
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Ошибка при записи ${filePath}:`, error);
    throw error;
  }
}

// Загружаем данные при инициализации
let charges = loadData(chargesPath, []);
let pumps = loadData(pumpsPath, []);

// Экспортируем функции для работы с данными
export const db = {
  charges: {
    getAll() {
      return charges.filter(item => !item.deletedAt);
    },
    
    getById(id) {
      const item = charges.find(c => c.id === id && !c.deletedAt);
      return item || null;
    },
    
    getByFilter(filter = {}) {
      let result = charges.filter(item => !item.deletedAt);
      
      if (filter?.in?.ids && filter.in.ids.length > 0) {
        result = result.filter(item => filter.in.ids.includes(item.id));
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
      const index = charges.findIndex(c => c.id === id && !c.deletedAt);
      if (index === -1) {
        return null;
      }
      
      const now = new Date().toISOString();
      charges[index] = {
        ...charges[index],
        ...data,
        id,
        updatedAt: now
      };
      saveData(chargesPath, charges);
      return charges[index];
    },
    
    delete(id) {
      const index = charges.findIndex(c => c.id === id && !c.deletedAt);
      if (index === -1) {
        return false;
      }
      
      const now = new Date().toISOString();
      charges[index].deletedAt = now;
      charges[index].updatedAt = now;
      saveData(chargesPath, charges);
      return true;
    }
  },
  
  pumps: {
    getAll() {
      return pumps.filter(item => !item.deletedAt);
    },
    
    getById(id) {
      const item = pumps.find(p => p.id === id && !p.deletedAt);
      return item || null;
    },
    
    getByFilter(filter = {}) {
      let result = pumps.filter(item => !item.deletedAt);
      
      if (filter?.in?.ids && filter.in.ids.length > 0) {
        result = result.filter(item => filter.in.ids.includes(item.id));
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
      const index = pumps.findIndex(p => p.id === id && !p.deletedAt);
      if (index === -1) {
        return null;
      }
      
      const now = new Date().toISOString();
      pumps[index] = {
        ...pumps[index],
        ...data,
        id,
        updatedAt: now
      };
      saveData(pumpsPath, pumps);
      return pumps[index];
    },
    
    delete(id) {
      const index = pumps.findIndex(p => p.id === id && !p.deletedAt);
      if (index === -1) {
        return false;
      }
      
      const now = new Date().toISOString();
      pumps[index].deletedAt = now;
      pumps[index].updatedAt = now;
      saveData(pumpsPath, pumps);
      return true;
    }
  }
};

export default db;
