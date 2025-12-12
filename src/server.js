import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import './database.js'; // Инициализация базы данных

const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Включаем introspection для GraphQL Playground
    csrfPrevention: false, // Отключаем CSRF защиту для тестового сервера
    resolverValidationOptions: {
      requireResolversForResolvers: false, // Не требовать резолверы для всех типов
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀 GraphQL сервер запущен на ${url}`);
  console.log(`📊 GraphQL Playground доступен на ${url}`);
}

startServer().catch((error) => {
  console.error('Ошибка при запуске сервера:', error);
  process.exit(1);
});

