<template>
  <div
    ref="viewerContainer"
    style="width: 100%; height: 600px; border: 1px solid #000;"
  >
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue" 
import { xmlStr } from "@/mock/xmlStr";
import BpmnModeler from "bpmn-js/lib/Modeler";
import type Canvas from "diagram-js/lib/core/Canvas";

// 引入编辑样式和工具栏
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-js.css";

const viewerContainer = ref<HTMLDivElement | null>(null);
let modeler: BpmnModeler | null = null;

onMounted(() => { 
  if (!viewerContainer.value) return;
  modeler = new BpmnModeler({
    container: viewerContainer.value,
  });

  modeler.importXML(xmlStr);

  const canvas = modeler.get<Canvas>("canvas");
  canvas.zoom("fit-viewport");
})

onBeforeUnmount(() => {
  modeler?.destroy();
  modeler = null;
})
</script>

<style scoped>
</style>