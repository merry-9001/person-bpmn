<template>
  <div class="custom-properties-panel">
    <div class="empty" v-if="selectedElements.length <= 0">请选择一个元素</div>
    <div class="empty" v-else-if="selectedElements.length > 1">
      只能选择一个元素
    </div>
    <div v-else>
      <fieldset class="element-item">
        <label>id</label>
        <span>{{ element?.id }}</span>
      </fieldset>
      <fieldset class="element-item">
        <label>name</label>
        <input :value="businessObject?.name"
        @change="(event)=>changeField(event, 'name')"
      </fieldset>
      <fieldset class="element-item">
        <label>customProps</label>
        <input :value="element?.customProps"
        @change="(event)=>changeField(event, 'customProps')"
      </fieldset>
      <fieldset class="element-item">
        <label>节点颜色</label>
        <input type="color" :value="element?.color"
        @change="(event)=>changeField(event, 'color')"
      </fieldset>
      <fieldset class="element-item" v-if="isEvent">
        <label>修改event节点类型</label>
        <select @change="changeEventType" :value="eventType">
          <option
            v-for="option in eventTypes"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </fieldset>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRaw } from "vue";
const props = defineProps({
  modeler: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
const { modeler } = props;

type BpmnElement = {
  id?: string;
  type?: string;
  businessObject?: {
    id?: string;
    name?: string;
    $type?: string;
  };
  customProps?: string;
  color?: string;
};

const element = ref<BpmnElement | null>(null);
const selectedElements = ref<BpmnElement[]>([]);
const businessObject = ref<BpmnElement["businessObject"] | null>(null);

const eventTypes = ref([
  { label: "默认", value: "" },
  { label: "MessageEventDefinition", value: "bpmn:MessageEventDefinition" },
  { label: "TimerEventDefinition", value: "bpmn:TimerEventDefinition" },
  {
    label: "ConditionalEventDefinition",
    value: "bpmn:ConditionalEventDefinition",
  },
]);
const eventType = ref("");

const isEvent = computed(() => {
  return element.value?.type?.includes("Event") ?? false;
});
  
function changeEventType(event: Event) {
  // 改变下拉框
  const target = event.target as HTMLSelectElement | null;
  if (!(target instanceof HTMLSelectElement)) return;
  const value = target.value;
  const bpmnReplace = modeler.get("bpmnReplace");
  eventType.value = value;
  bpmnReplace.replaceElement(toRaw(element.value), {
    type: businessObject.value!.$type,
    eventDefinitionType: value,
  });
}

function updateProperties(properties: Record<string, unknown>) {
  if (!element.value) return;
  const modeling = modeler.get("modeling");

  modeling.updateProperties(toRaw(element.value), properties);
}

function changeField(event: Event, type: string) {
  const target = event.target as HTMLInputElement | null;
  if (!(target instanceof HTMLInputElement)) return;
  const value = target.value;
  console.log(value);
  const properties = { [type]: value };
  if (type === "color") {
    onChangeColor(value);
  }
  if (!element.value) return;
  (element.value as any)[type] = value;
  updateProperties(properties);
}

function onChangeColor(color: string) {
  if (!element.value) return;
  const modeling = modeler.get("modeling");
  modeling.setColor(toRaw(element.value), {
    stroke: null,
    fill: color,
  });
}

function init() {
  const selectionChanged = (e) => {
    selectedElements.value = e.newSelection;
    element.value = e.newSelection[0] || null;
    businessObject.value = e.newSelection[0]?.businessObject || null;
  };

  const elementChanged = (e) => {
    const currentElement = element.value;
    if (currentElement && e.element.id === currentElement.id) {
      element.value = e.element;
    }
  };

  modeler.on("selection.changed", selectionChanged);
  modeler.on("element.changed", elementChanged);

  onBeforeUnmount(() => {
    modeler.off("selection.changed", selectionChanged);
    modeler.off("element.changed", elementChanged);
  });
}

onMounted(() => {
  init();
});
</script>

<style scoped>
.custom-properties-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  background-color: #fff9f9;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
}
.element-item {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.element-item label {
  font-weight: bold;
  margin-bottom: 6px;
}
</style>
