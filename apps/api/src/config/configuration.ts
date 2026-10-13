export default () => ({
  app: {
    name: 'vibrix-api',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
});
