<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <div style="display: flex; align-items: center; gap: 8px">
      <button @click="handleNew">新建</button>
      <label style="display: inline-block">
        <span
          style="
            padding: 6px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            display: inline-block;
          "
        >
          导入 XML
        </span>
        <input
          type="file"
          accept=".bpmn,.xml"
          style="display: none"
          @change="handleImport"
        />
      </label>

      <button @click="() => handleExportXML(true)">导出 XML</button>
      <button @click="handleExportSVG">导出 SVG</button>
    </div>
    <div class="container">
      <div ref="canvasRef" class="canvas"></div>
      <div class="panel" id="js-properties-panel"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { xmlStr } from "@/mock/xmlStr";
import BpmnModeler from "bpmn-js/lib/Modeler";
import type Canvas from "diagram-js/lib/core/Canvas";

// 引入编辑样式和工具栏
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-js.css";

// 加入属性控制面板相关样式
import "@bpmn-io/properties-panel/assets/properties-panel.css";

// 加入汉化模块
// import CustomTranslateModule from "@/additional-modules/Translate";
import type ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import type EventBus from "diagram-js/lib/core/EventBus";

import CustomModeler from "./customModeler2/index.js"

const canvasRef = ref<HTMLDivElement | null>(null);
let modeler: BpmnModeler | null = null;

onMounted(() => {
  if (!canvasRef.value) return;  

  modeler = new CustomModeler({
    container: canvasRef.value,
  })

  loadXML(xmlStr);
  modelerListener();
  eventBusListener();
  const canvas = modeler!.get<Canvas>("canvas");
  canvas.zoom("fit-viewport");
});

async function loadXML(xml: string) {
  if (!modeler) return;
  try {
    await modeler.importXML(xml);
  } catch (err) {
    console.error("无法导入 BPMN 2.0 XML", err);
  }
}

async function handleNew() {
  const empty = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false"/>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"/>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
  await loadXML(empty);

  const canvas = modeler?.get<Canvas>("canvas");
  canvas?.zoom("fit-viewport");
}

async function handleExportXML(pretty = true) {
  if (!modeler) return;
  const { xml } = await modeler.saveXML({ format: pretty });
  download("diagram.bpmn", xml as string, "application/xml");
}

async function handleExportSVG() {
  if (!modeler) return;
  const { svg } = await modeler.saveSVG();
  download("diagram.svg", svg, "image/svg+xml");
}

// 导入
async function handleImport(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const text = await file.text();
  await loadXML(text);
  const canvas = modeler?.get<Canvas>("canvas");
  canvas?.zoom("fit-viewport");
  input.value = "";
}

function download(filename: string, data: string, mime: string) {
  const blob = new Blob([data], { type: mime });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

onBeforeUnmount(() => {
  modeler?.destroy();
  modeler = null;
});

function modelerListener() {
  if (!modeler) return;

  const events = ["shape.added", "shape.removed", "element.move.end"];

  events.forEach(function (event) {
    modeler?.on(event, function (e: any) {
      const elementRegistry = modeler?.get<ElementRegistry>("elementRegistry");
      const shape = e.element ? elementRegistry?.get(e.element.id) : e.element;
      console.log(shape);
      if (event === "element.move.end") {
        console.log("元素移动结束", shape);
      } else if (event === "shape.added") {
        console.log("元素添加", shape);
      } else if (event === "shape.removed") {
        console.log("元素删除", shape);
      }
    });
  });
}

function eventBusListener() {
  if (!modeler) return;
  const eventBus = modeler.get<EventBus>("eventBus");

  const eventTypes = ["element.click", "element.changed"];

  eventTypes.forEach((eventType) => {
    eventBus.on(eventType, function (e: any) {
      if (!e || e.element.type === "bpmn:Process") return;
      // console.log("元素被点击", e);

      const elementRegistry = modeler?.get<ElementRegistry>("elementRegistry");
      const shape = e.element ? elementRegistry?.get(e.element.id) : e.element;
      console.log(shape);
    });
  });
}
</script>

<style scoped>
.container {
  width: 100%;
  position: relative;
  background-color: #ffffff;
  height: calc(100vh-52px);
}
.canvas {
  width: 100%;
  height: 600px;
  border: 1px solid #000;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
button {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
}
button:hover {
  background-color: #f6f6f6;
}
</style>
