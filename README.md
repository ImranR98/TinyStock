# TinyStock
Tiny stock keeping App.

## Development
This is a standard client-server Web app packaged in an Electron container.

Although they are meant to be packaged together, the backend and frontend run independently and often do during development.

All below commands are run from the root directory.

### Directory Structure
- The `models` directory contains a `models.ts` file shared between the backend and frontend. It is treated as a separate npm module that is build then installed in the front/back-ends. All build artifacts are stored here too.
- The `backend` directory contains all backend code. Build artifacts are stored in `backend/dist`.
- The `frontend` directory contains all frontend code. Build artifacts are stored in `frontend-dist`.

### Building
Each module must be built before it can run. They must be built in this order:
1. Build `models` module: `npm run models-build`.
2. Build `backend` module: `npm run back-build`.
3. Build `frontend` module: `npm run front-build`.

### Running in Development
When developing, the modules can be set to run continuously and automatically recompile when relevant files change.
1. Continuously build the `models` module: `npm run models-dev`.
2. Continously run the `backend` module without building: `npm run back-dev`.
3. Continuously run the `frontend` module without building: `npm run front-dev`.
Note that the frontend cannot run (well) if the backend is not already running, and neither will work if the models have not been compiled.

### Electron
Once all modules have been built, the application can be run in an electron container using `npm run app`.

The electron app can be compiled using `npm run app-build-linux`, `npm run app-build-windows`, or `npm run app-build-mac` for Linux, Windows, or MacOS respectively. Build artifacts are stored in the `build` directory.

## To Do

- [ ] Encrypt saved data with password.
- [ ] Add report pages to see total sales, top items, etc.