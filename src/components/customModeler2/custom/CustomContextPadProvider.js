import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import {
  customShapeAction,
  customFlowAction,
  batchCreateCustom,
} from "@/utils/util";
export default function CustomContextPadProvider(
  config,
  contextPad,
  create,
  elementFactory,
  bpmnFactory,
  injector,
  translate,
  modeling,
  connect
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.modeling = modeling;
  this.connect = connect;
  this.bpmnFactory = bpmnFactory;
  
  // autoPlace 是bpmn.js内置的一个服务
  // 可以自动计算新元素的摆放位置，并且把新节点加到当前图上
  // 可以通过config.autoPlace:false 来禁用自动布局，改为手动拖拽
  if (config.autoPlace !== false) {
    this.autoPlace = injector.get("autoPlace", false);
  }

  contextPad.registerProvider(this);
}

CustomContextPadProvider.prototype.getContextPadEntries = function (element) {
  let actions = {};
  let businessObject = element.businessObject;
  const {
    create,
    elementFactory,
    bpmnFactory,
    autoPlace,
    translate,
    modeling,
    connect,
  } = this;

  function startConnect(event, element) {
    connect.start(event, element);
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

  function createConnect(type, group, className, title, options) {
    return {
      group,
      className,
      title,
      action: {
        click: startConnect,
        dragstart: startConnect,
      },
    };
  }

  function createAction(type, group, className, title, options) {
    function appendCustomElements(type) {
      
      return function (event, element) {

        if (autoPlace) {
          const businessObject = bpmnFactory.create(type);
          const shape = elementFactory.createShape(
            Object.assign({
              type,
              businessObject,
            },options),
          );
          autoPlace.append(element, shape);
        } else {
          const fn = appendCustomElementsStart(type);
          fn(event, element);
        }
      };
    }

    function appendCustomElementsStart(type) {
      return function (event, element) {
        const businessObject = bpmnFactory.create(type);
        const shape = elementFactory.createShape(
          Object.assign({
            type,
            businessObject,
          },options),
        );
        create.start(event, shape, element);
      };
    }

    return {
      group,
      className,
      title: translate(title),
      action: {
        click: appendCustomElements(type),
        dragstart: appendCustomElementsStart(type),
      },
    };
  }

  if (
    isAny(businessObject, [
      "bpmn:Task",
      "bpmn:StartEvent",
      "bpmn:BusinessRuleTask",
      "bpmn:ExclusiveGateway",
      "bpmn:DataObjectReference",
    ])
  ) {
    Object.assign(actions, {
      ...batchCreateCustom(customShapeAction, createAction),
      ...batchCreateCustom(customFlowAction, createConnect),
      edit: editElement(),
      delete: deleteElement(),
    });
  }
  //结束节点和连线只有删除和编辑
  if (isAny(businessObject, ["bpmn:EndEvent", "bpmn:SequenceFlow"])) {
    Object.assign(actions, {
      edit: editElement(),
      delete: deleteElement(),
    });
  }
  console.log(actions)
  return actions;
};

CustomContextPadProvider.$inject = [
  "config",
  "contextPad",
  "create",
  "elementFactory",
  "bpmnFactory",
  "injector",
  "translate",
  "modeling",
  "connect",
];
