// Загрузка реальной GraphQL схемы из файла
import { readFileSync } from "fs";

// Путь к реальной схеме
const schemaPath =
  "/Users/matu1/Pulkovo/shared_graphql_schema/lib/src/graphql_generated/schema/schema.gql";

// Читаем схему из файла
let realSchema = readFileSync(schemaPath, "utf-8");

// Исправляем проблему с пустым input типом CancelTaskInput
// Добавляем временное поле, чтобы схема была валидной
realSchema = realSchema.replace(
  /^input CancelTaskInput\s*$/m,
  "input CancelTaskInput {\n  _placeholder: String\n}"
);

// Экспортируем схему
export const typeDefs = realSchema;
