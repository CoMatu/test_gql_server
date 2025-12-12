# Тестовый GraphQL сервер для отладки мобильного приложения

Локальный GraphQL сервер для тестирования и отладки операций с заправками и перекачками расходных материалов.

## Технологии

- **Node.js** - среда выполнения
- **Apollo Server** - GraphQL сервер
- **JSON файлы** - локальное хранение данных (файлы `data/charges.json` и `data/pumps.json`)

## Установка

1. Убедитесь, что у вас установлен Node.js (версия 18 или выше)

2. Установите зависимости:
```bash
npm install
```

## Запуск сервера

Для запуска сервера используйте команду:

```bash
npm start
```

Или для запуска в режиме разработки с автоматической перезагрузкой:

```bash
npm run dev
```

Сервер будет доступен по адресу: `http://localhost:4000`

## Подключение в мобильном приложении

### Определение IP адреса компьютера

Для подключения мобильного устройства к серверу необходимо использовать IP адрес вашего компьютера вместо `localhost`.

**На macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**На Windows:**
```bash
ipconfig
```

Ищите IP адрес в локальной сети (обычно начинается с `192.168.x.x` или `10.x.x.x`).

### Настройка для Android

1. Убедитесь, что мобильное устройство и компьютер подключены к одной Wi-Fi сети.

2. В конфигурации GraphQL клиента в приложении укажите URL сервера:
   ```
   http://<IP_АДРЕС_КОМПЬЮТЕРА>:4000
   ```
   Например: `http://192.168.1.100:4000`

3. Для Android эмулятора можно использовать специальный адрес:
   - Android Emulator: `http://10.0.2.2:4000` (эмулятор автоматически перенаправляет на localhost хоста)

### Настройка для iOS

1. Убедитесь, что iPhone/iPad и компьютер подключены к одной Wi-Fi сети.

2. В конфигурации GraphQL клиента в приложении укажите URL сервера:
   ```
   http://<IP_АДРЕС_КОМПЬЮТЕРА>:4000
   ```
   Например: `http://192.168.1.100:4000`

3. Для iOS симулятора можно использовать:
   - iOS Simulator: `http://localhost:4000` (симулятор использует сеть хоста)

### Пример настройки Apollo Client (Flutter/Dart)

```dart
import 'package:graphql_flutter/graphql_flutter.dart';

final HttpLink httpLink = HttpLink(
  'http://192.168.1.100:4000', // Замените на IP вашего компьютера
);

final GraphQLClient client = GraphQLClient(
  link: httpLink,
  cache: GraphQLCache(),
);
```

### Пример настройки Apollo Client (React Native)

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://192.168.1.100:4000', // Замените на IP вашего компьютера
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### Проверка подключения

После настройки подключения в приложении выполните простой запрос для проверки:

```graphql
query {
  consumableMaterialCharges {
    id
  }
}
```

Если запрос выполняется успешно, подключение настроено правильно.

### Решение проблем

**Проблема: Не удается подключиться с мобильного устройства**

1. Убедитесь, что сервер запущен на компьютере
2. Проверьте, что устройство и компьютер в одной сети Wi-Fi
3. Проверьте, что файрвол не блокирует порт 4000
4. Попробуйте отключить VPN, если он активен

**Проблема: CORS ошибки**

Сервер настроен для работы с мобильными приложениями и не требует специальной настройки CORS.

## Использование

### GraphQL Playground

После запуска сервера откройте браузер и перейдите по адресу `http://localhost:4000`. Вы увидите GraphQL Playground, где можно выполнять запросы и мутации.

### Доступные операции

#### Запросы (Queries)

**Получить список заправок:**
```graphql
query {
  consumableMaterialCharges {
    id
    amount
    chargedAt
    consumableMaterialCode
    operatorId
    taskId
    vehicleId
    createdAt
    updatedAt
  }
}
```

**Получить заправки с фильтрацией по ID:**
```graphql
query {
  consumableMaterialCharges(filter: { in: { ids: ["id1", "id2"] } }) {
    id
    amount
    chargedAt
    consumableMaterialCode
  }
}
```

#### Мутации (Mutations)

**Создать заправку:**
```graphql
mutation {
  createConsumableMaterialCharge(input: {
    amount: "100.5"
    chargedAt: "2024-01-15T10:30:00Z"
    consumableMaterialCode: "FUEL"
    flightId: "FL123"
    operatorId: "OP001"
    taskId: "TASK001"
    vehicleId: "VEH001"
  }) {
    ... on ConsumableMaterialCharge {
      id
      amount
      chargedAt
      createdAt
    }
    ... on ConsumableMaterialChargeError {
      message
    }
  }
}
```

**Обновить заправку:**
```graphql
mutation {
  updateConsumableMaterialCharge(input: {
    id: "existing-id"
    amount: "150.0"
    chargedAt: "2024-01-15T11:00:00Z"
    consumableMaterialCode: "FUEL"
    operatorId: "OP001"
    taskId: "TASK001"
    vehicleId: "VEH001"
  }) {
    ... on ConsumableMaterialCharge {
      id
      amount
      updatedAt
    }
    ... on ConsumableMaterialChargeError {
      message
    }
  }
}
```

**Удалить заправку:**
```graphql
mutation {
  deleteConsumableMaterialCharge(id: "existing-id")
}
```

**Создать перекачку:**
```graphql
mutation {
  createConsumableMaterialPump(input: {
    amount: "200.0"
    amountAfterPump: "500.0"
    amountBeforePump: "300.0"
    consumableMaterialCode: "FUEL"
    pumpedAt: "2024-01-15T12:00:00Z"
    tankNumber: "TANK001"
  }) {
    ... on ConsumableMaterialPump {
      id
      amount
      amountAfterPump
      amountBeforePump
      pumpedAt
      createdAt
    }
    ... on ConsumableMaterialPumpError {
      message
    }
  }
}
```

**Обновить перекачку:**
```graphql
mutation {
  updateConsumableMaterialPump(input: {
    id: "existing-id"
    amount: "250.0"
    amountAfterPump: "550.0"
    amountBeforePump: "300.0"
    consumableMaterialCode: "FUEL"
    pumpedAt: "2024-01-15T13:00:00Z"
    tankNumber: "TANK001"
  }) {
    ... on ConsumableMaterialPump {
      id
      amount
      updatedAt
    }
    ... on ConsumableMaterialPumpError {
      message
    }
  }
}
```

**Удалить перекачку:**
```graphql
mutation {
  deleteConsumableMaterialPump(id: "existing-id")
}
```

## Структура проекта

```
test_gql_server/
├── package.json              # Зависимости и скрипты
├── src/
│   ├── server.js            # Точка входа, настройка Apollo Server
│   ├── schema.js            # GraphQL схема
│   ├── resolvers.js         # Резолверы для запросов и мутаций
│   ├── database.js          # Работа с JSON файлами для хранения данных
│   └── models/              # Модели для работы с данными
│       ├── charge.js        # Модель ConsumableMaterialCharge
│       └── pump.js          # Модель ConsumableMaterialPump
├── data/
│   ├── charges.json         # JSON файл с данными о заправках
│   └── pumps.json           # JSON файл с данными о перекачках
└── README.md                # Этот файл
```

## Хранение данных

Данные сохраняются в JSON файлах в директории `data/`:
- `data/charges.json` - хранит данные о заправках
- `data/pumps.json` - хранит данные о перекачках

Файлы автоматически создаются при первом запуске сервера. Все операции удаления выполняются как "soft delete" - запись помечается полем `deletedAt`, но не удаляется физически из файла.

## Настройка

### Изменение порта

По умолчанию сервер запускается на порту 4000. Для изменения порта установите переменную окружения:

```bash
PORT=3000 npm start
```

### Путь к схеме GraphQL

Схема загружается из файла:
`/Users/matu1/Pulkovo/shared_graphql_schema/lib/src/graphql_generated/schema/schema.gql`

Если путь к схеме изменился, обновите путь в файле `src/schema.js`.

## Обработка ошибок

Все мутации возвращают union типы, которые могут быть либо объектом данных, либо объектом ошибки:

- `ConsumableMaterialChargePayload` = `ConsumableMaterialCharge` | `ConsumableMaterialChargeError`
- `ConsumableMaterialPumpPayload` = `ConsumableMaterialPump` | `ConsumableMaterialPumpError`

При возникновении ошибки проверяйте поле `__typename` в ответе или используйте фрагменты для обработки обоих случаев.

## Примечания

- Данные сохраняются локально в JSON файлах
- При перезапуске сервера данные сохраняются
- Для полной очистки данных удалите файлы `data/charges.json` и `data/pumps.json`
- Сервер предназначен только для локальной разработки и тестирования

