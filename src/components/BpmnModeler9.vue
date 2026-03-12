<template>
  <div style="display: flex; flex-direction: column; gap: 8px">
    <div class="container">
      <div ref="canvasRef" class="canvas"></div>
      <PropertiesView :modeler="modeler" v-if="modeler"></PropertiesView>
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

import type EventBus from "diagram-js/lib/core/EventBus";

import PropertiesView from "./customPropertiesPanel/PropertiesView.vue";
import type Modeler from "bpmn-js/lib/Modeler";


const canvasRef = ref<HTMLDivElement | null>(null);
let modeler = ref<Modeler | null>(null);

onMounted(() => {
  if (!canvasRef.value) return;
  modeler.value = new BpmnModeler({
    container: canvasRef.value,
  });

  loadXML(xmlStr);

  eventBusListener();
  const canvas = modeler.value.get<Canvas>("canvas");
  canvas.zoom("fit-viewport");
});

async function loadXML(xml: string) {
  if (!modeler.value) return;
  try {
    await modeler.value.importXML(xml);
  } catch (err) {
    console.error("无法导入 BPMN 2.0 XML", err);
  }
}


onBeforeUnmount(() => {
  modeler.value?.destroy();
  modeler.value = null;
});

function eventBusListener() {
  if (!modeler.value) return;
  const m = modeler.value;
  const eventBus = m.get<EventBus>("eventBus");

  const eventTypes = ["element.click", "element.changed"];

  eventTypes.forEach((eventType) => {
    eventBus.on(eventType, async function (e: any) {
      if (!e || e.element.type === "bpmn:Process") return;
      if (eventType === "element.changed") {
        const { xml } = await m.saveXML({ format: true });

        console.log(xml);
      }
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
</style>
