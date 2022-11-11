import { registerPlugin } from '@capacitor/core';

import type { PushIOManagerPlugin } from './definitions';

const PushIOManager = registerPlugin<PushIOManagerPlugin>('PushIOManager',);

export * from './definitions';
export { PushIOManager };
