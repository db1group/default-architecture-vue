import { StoreModulesLoader } from './store-modules.loader';

// Store modules inside src folder terminating with .store.ts
const storeFilesLoader = require.context('../../', true, /.store.ts/);
const storeModulesLoader: StoreModulesLoader = new StoreModulesLoader(storeFilesLoader);

export default storeModulesLoader.stores;
