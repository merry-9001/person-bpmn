import {
  customFlowAction,
  customShapeAction,
  batchCreateCustom,
} from "@/utils/util";

export default function PaletteProvider(
  bpmnFactory,
  palette,
  create,
  elementFactory,
  translate,
  globalConnect
) {
  this.bpmnFactory = bpmnFactory;
  this.palette = palette;
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.globalConnect = globalConnect;

  palette.registerProvider(this);
}

PaletteProvider.prototype.getPaletteEntries = function () {
  let actions = {};
  const { create, elementFactory, translate } = this;

  function createConnect(type, group, className, title, options) {
    return {
      group,
      className,
      title: translate("新增" + title),
      action: {
        click: function (event) {
          globalConnect.toggle(event);
        },
      },
    };
  }

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      const shape = elementFactory.createShape(
        Object.assign({ type: type }, options)
      );
      create.start(event, shape);
    }

    return {
      group,
      className,
      title: translate("新增" + title),
      action: {
        dragstart: createListener,
        click: createListener,
      },
    };
  }

  Object.assign(actions, {
    ...batchCreateCustom(customShapeAction, createAction),
    ...batchCreateCustom(customFlowAction, createConnect),
  });

  return actions;
};

PaletteProvider.$inject = [
  "bpmnFactory",
  "palette",
  "create",
  "elementFactory",
  "translate",
  "globalConnect",
];
