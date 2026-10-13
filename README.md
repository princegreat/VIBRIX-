# VIBRIX

VIBRIX is at the initial Stage One development stage. The repository currently provides a NestJS API foundation and a health endpoint; user, messaging, room, video, wallet, and administrative features are not implemented.

## Requirements

- Node.js 20 or later
- npm

## Development

```sh
npm install
npm run start
```

The API listens on port `3000` by default. Set `PORT` in the environment to use another port. The health endpoint is `GET /api/v1/health`.

Run `npm test` for the API test suite and `npm run build` to compile the API.

## Current scope

This initial milestone does not include authentication, a database, messaging, video calls, wallets, payments, subscriptions, withdrawals, or staff controls. No coin allocation or real-money functionality is active. Those features require separate implementation and verification milestones.