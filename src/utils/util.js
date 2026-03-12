const customShapeAction = [
  {
    type: "create.start-event",
    action: [
      "bpmn:StartEvent",
      "event",
      "icon-custom icon-custom-start",
      "开始节点",
    ],
  },
  {
    type: "create.end-event",
    action: [
      "bpmn:EndEvent",
      "event",
      "icon-custom icon-custom-end",
      "结束节点",
    ],
  },
  {
    type: "create.task",
    action: ["bpmn:Task", "activity", "icon-custom duyi-task", "普通任务"],
  },
  {
    type: "create.businessRule-task",
    action: [
      "bpmn:BusinessRuleTask",
      "activity",
      "icon-custom icon-custom-business-rule",
      "businessRule任务",
    ],
  },
  {
    type: "create.exclusive-gateway",
    action: [
      "bpmn:ExclusiveGateway",
      "activity",
      "icon-custom icon-custom-exclusive-gateway",
      "网关",
    ],
  },
  {
    type: "create.dataObjectReference",
    action: [
      "bpmn:DataObjectReference",
      "activity",
      "icon-custom icon-custom-data",
      "变量",
    ],
  },
];

const customFlowAction = [
  {
    type: "global-connect-tool",
    action: [
      "bpmn:SequenceFlow",
      "tools",
      "icon-custom icon-custom-flow",
      "连接线",
    ],
  },
];

const customElements = [
  "bpmn:StartEvent",
  "bpmn:EndEvent",
  "bpmn:Task",
  "bpmn:UserTask",
  "bpmn:BusinessRuleTask",
  "bpmn:ExclusiveGateway",
  "bpmn:DataObjectReference",
]

const customConfig = {
  "bpmn:Task": {
    url: "/src/assets/box.png",
    title: "普通任务",
    attr: {
      x:0, y:0, width:48, height:48
    }
  },
  "bpmn:UserTask": {
    url: "/src/assets/box.png",
    title: "用户任务",
    attr: {
      x:0, y:0, width:48, height:48
    }
  },
  "bpmn:StartEvent": {
    url: "/src/assets/start.png",
    title: "开始节点",
    attr: {
      x:0, y:0, width:40, height:40
    }
  },
  "bpmn:EndEvent": {
    url: "/src/assets/end.png",
    title: "结束节点",
    attr: {
      x:0, y:0, width:40, height:40
    }
  },
  "bpmn:SequenceFlow": {
    url: "/src/assets/end.png",
    title: "连接线",
  },
  "bpmn:BusinessRuleTask": {
    url: "/src/assets/business-rule.png",
    title: "businessRule任务",
    attr: {
      x:0, y:0, width:48, height:48
    }
  },
  "bpmn:ExclusiveGateway": {
    url: "/src/assets/exclusive-gateway.png",
    title: "网关",
    attr: {
      x:0, y:0, width:48, height:48
    }
  },
  "bpmn:DataObjectReference": {
    url: "/src/assets/data.png",
    title: "变量",
    attr: {
      x:0, y:0, width:48, height:48
    }
  },
}

// 有label标签的元素
const hasLabelElements = [
  "bpmn:StartEvent",
  "bpmn:EndEvent",
  "bpmn:ExclusiveGateway",
  "bpmn:DataObjectReference",
]

export function batchCreateCustom(actions, fn) {
  const customs = {};
  actions.forEach((item) => {
    customs[item["type"]] = fn(...item["action"]);
  });
  return customs;
}

export { customFlowAction, customShapeAction };
export { customElements, customConfig, hasLabelElements };