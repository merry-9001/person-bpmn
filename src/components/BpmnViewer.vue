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
import BpmnViewer from "bpmn-js/lib/Viewer";
import type Canvas from "diagram-js/lib/core/Canvas";

const viewerContainer = ref<HTMLDivElement | null>(null);
let viewer: BpmnViewer | null = null;

onMounted(() => { 
  if (!viewerContainer.value) return;
  viewer = new BpmnViewer({
    container: viewerContainer.value,
  });

  viewer.importXML(xmlStr);

  const canvas = viewer.get<Canvas>("canvas");
  canvas.zoom("fit-viewport");
})

onBeforeUnmount(() => {
  viewer?.destroy();
  viewer = null;
})
</script>

<style scoped>
</style>