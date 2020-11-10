# TinyStock
Tiny stock keeping App.

## Development

### Backend

All backend code is built with Node.

The `main.ts` file is the entrypoint. It handles Electron but can be run independently as well.

Before running for the first time, run `npm i` to install dependencies.

Run `npm run back` for a dev server. The app will automatically reload if you change any of the source files. This will not launch an Electron instance but can be accessed using a browser or other tool.

Run `npm run build-back` to build the project. The build artifacts will be stored in the `/dist` directory, and are used by Electron.

### Frontend

The frontend is built with Angular and is stored in the frontend directory.

Before running for the first time, run `npm i` and `npm install -g @angular/cli` (from inside the `/frontend` directory) to install dependencies and the Angular CLI.

Run `npm run front` for a dev server. Navigate to `http://localhost:4200/` in a browser. The app will automatically reload if you change any of the source files.

Run `npm run build-front` to build the project. The build artifacts will be stored in the `frontend/dist/frontend` directory.

### Electron

Run `npm run app` to run the most recent build of the backend (which serves the most recent build of the frontend) in an Electron container.

Run `npm run build-app` to use the most recent backend and frontend builds to compile an Electron app for the host platform. Builds are stored in `/build`.