import { kintRoot } from '../../kint';

export const kintUser = kintRoot.extendConfig({ auth: { allowRoles: '*' } });
