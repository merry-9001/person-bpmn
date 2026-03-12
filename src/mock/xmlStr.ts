export const xmlStr = `
<?xml version="1.0" encoding="UTF-8"?>
<!--
  一个最小可运行的 BPMN 2.0 示例
  包含：开始事件 → 用户任务 → 结束事件
-->
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
             xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             targetNamespace="http://bpmn.io/schema/bpmn">

  <!-- 1. 定义一个流程 -->
  <process id="Process_1" isExecutable="true">

    <!-- 开始事件 -->
    <startEvent id="StartEvent_1" name="开始" />

    <!-- 用户任务 -->
    <userTask id="UserTask_1" name="执行任务" />

    <!-- 结束事件 -->
    <endEvent id="EndEvent_1" name="结束" />

    <!-- 顺序流（连接三者） -->
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="UserTask_1" />
    <sequenceFlow id="Flow_2" sourceRef="UserTask_1" targetRef="EndEvent_1" />

  </process>

  <!-- 2. 图形信息 (BPMN Diagram Interchange) -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">

      <!-- 开始事件图形 -->
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <omgdc:Bounds x="150" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>

      <!-- 用户任务图形 -->
      <bpmndi:BPMNShape id="UserTask_1_di" bpmnElement="UserTask_1">
        <omgdc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>

      <!-- 结束事件图形 -->
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <omgdc:Bounds x="400" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>

      <!-- 顺序流连线 -->
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <omgdi:waypoint x="186" y="118" />
        <omgdi:waypoint x="240" y="118" />
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <omgdi:waypoint x="340" y="118" />
        <omgdi:waypoint x="400" y="118" />
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;