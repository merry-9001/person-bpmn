// 修改为当前目录下的diagram-palette
import PaletteModule from './diagram-palette';
import CreateModule from 'diagram-js/lib/features/create';
// import SpaceToolModule from '../space-tool';

// bpmn源码对space-tool进行了修改，这里使用diagram-js的原始版本
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import HandToolModule from 'diagram-js/lib/features/hand-tool';
import GlobalConnectModule from 'diagram-js/lib/features/global-connect';
import translate from 'diagram-js/lib/i18n/translate';

import PaletteProvider from './PaletteProvider';

export default {
  __depends__: [
    PaletteModule,
    CreateModule,
    SpaceToolModule,
    LassoToolModule,
    HandToolModule,
    GlobalConnectModule,
    translate
  ],
  __init__: [ 'paletteProvider' ],
  paletteProvider: [ 'type', PaletteProvider ]
};
