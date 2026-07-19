export default () => ({
  app: {
    port: Number(process.env.PORT) || 3000,
    environment: process.env.NODE_ENV || 'development',
  },

  database: {
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
    },

    mongodb: {
      uri: process.env.MONGODB_URI,
    },
  },

  authentication: {
    keycloak: {
      url: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    },
  },

  workflow: {
    flowable: {
      url: process.env.FLOWABLE_URL,
      username: process.env.FLOWABLE_USERNAME,
      password: process.env.FLOWABLE_PASSWORD,
    },
  },

  rules: {
    gorules: {
      url: process.env.GORULES_URL,
    },
  },

  cache: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  },

  messaging: {
    rabbitmq: {
      url: process.env.RABBITMQ_URL,
    },
  },
});
