import { defineStore } from "pinia";

interface BpmnState { 
  id: string;
  type: string;
  height: number;
  width: number;
  x: number;
  y: number;
}

export const useBpmnStore = defineStore("bpmn", {
  state: () => { 
    return {
      nodeVisible: false,
      nodeInfo: {} as BpmnState
    }
  },
  actions: {
    toggleNodeVisible(visible: boolean) {
      this.nodeVisible = visible;
    },
    setNodeInfo(info: any) {
      this.nodeInfo = info;
    }
  }
})