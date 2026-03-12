export default function CustomContextPadProvider(
  config,
  contextPad,
  create,
  elementFactory,
  injector,
  translate,
  modeling
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.modeling = modeling;

  // autoPlace 是bpmn.js内置的一个服务
  // 可以自动计算新元素的摆放位置，并且把新节点加到当前图上
  // 可以通过config.autoPlace:false 来禁用自动布局，改为手动拖拽
  if (config.autoPlace !== false) {
    this.autoPlace = injector.get("autoPlace", false);
  }

  contextPad.registerProvider(this);
}

CustomContextPadProvider.prototype.getContextPadEntries = function (element) {
  const { create, elementFactory, autoPlace, translate, modeling } = this;

  function appendTask(event, element) {
    if (autoPlace) {
      const shape = elementFactory.createShape({ type: "bpmn:Task" });
      autoPlace.append(element, shape);
    } else {
      // 进入拖拽模式
      appendTaskStart(event, element);
    }
  }

  function appendTaskStart(event, element) {
    const shape = elementFactory.createShape({ type: "bpmn:Task" });
    create.start(event, shape, element);
  }

  function clickElement(e) {
    console.log(element);
    console.log(e);
  }

  function removeElement(e) {
    modeling.removeElements([element]);
  }

  function editElement() {
    return {
      group: "edit",
      className: "icon-custom icon-custom-edit",
      title: translate("编辑"),
      action: {
        click: clickElement,
      },
    };
  }
  function deleteElement() {
    return {
      group: "edit",
      className: "icon-custom icon-custom-delete",
      title: translate("删除"),
      action: {
        click: removeElement,
      },
    };
  }

  return {
    "append.duyi-task-icon": {
      group: "model",
      className: "icon-custom duyi-task",
      title: translate("创建一个类型为duyi-task-icon的任务节点"),
      action: {
        click: appendTask,
        dragstart: appendTaskStart,
      },
    },
    edit: editElement(),
    delete: deleteElement(),
  };
};

CustomContextPadProvider.$inject = [
  "config",
  "contextPad",
  "create",
  "elementFactory",
  "injector",
  "translate",
  "modeling",
];
