import { RouteFromViewLoader } from './route-from-view.loader';
import { RouteConfig } from 'vue-router';

// Routes from Route decoratin *.view.vue files
const viewFilesLoader = require.context('../../', true, /.view.vue/);
const loadRoutesFromView: RouteFromViewLoader = new RouteFromViewLoader(viewFilesLoader);
const routes: RouteConfig[] = loadRoutesFromView.getRoutes();

export default routes;
