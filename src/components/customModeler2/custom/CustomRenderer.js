// 引入默认的renderer
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove,
} from "tiny-svg";
import inherits from "inherits-browser";

import { customConfig, hasLabelElements, customElements } from "@/utils/util";

const HIGH_PRIORITY = 1500;

export default function CustomRenderer(eventBus, bpmnRenderer) {
  BaseRenderer.call(this, eventBus, HIGH_PRIORITY);
  this.bpmnRenderer = bpmnRenderer;

  this.drawCustomElements = function (parentNode, element) {
    const { type } = element;
    const { url, attr } = customConfig[type];
    const customIcon = svgCreate("image", {
      ...attr,
      href: url,
    });

    element["width"] = attr.width;
    element["height"] = attr.height;

    svgAppend(parentNode, customIcon);

    // 判断是否有name属性决定是否渲染出label
    if (!hasLabelElements.includes(type) && element.businessObject.name) { 
      const text = svgCreate("text", {
        x: attr.x,
        y: attr.y + attr.height + 15,
        fill: "#000",
        "font-size": 14,
      })
      text.innerHTML = element.businessObject.name;
      svgAppend(parentNode, text);
    }

    return customIcon;
  };

  this.drawElements = function (parentNode, element) { 
    const type = element.type;

    if (type !== "label") {
      if (customElements.includes(type)) {
        return this.drawCustomElements(parentNode, element);
      }
      const shape = this.bpmnRenderer.drawShape(parentNode, element);
      return shape;
    }
    else { 
      element;
    }
  }
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ["eventBus", "bpmnRenderer"];

CustomRenderer.prototype.canRender = function (element) {
  return !element.labelTarget;
};

CustomRenderer.prototype.drawShape = function (parentNode, element) {
  return this.drawElements(parentNode, element);
};

// 连线
CustomRenderer.prototype.drawConnection = function (parentNode, element) { 
  const connection = this.bpmnRenderer.drawConnection(parentNode, element);
  if (connection) { 
    // 将连线设置为蓝色
    svgAttr(connection, { stroke: "#4A90E2", strokeWidth: 2 });

    // 处理箭头
    const markers = parentNode.querySelectorAll("marker");
    markers.forEach((marker) => { 
      const paths = marker.querySelectorAll("path");
      paths.forEach((path) => { 
        svgAttr(path, { fill: "#4A90E2", stroke: "#4A90E2" });
      })
    })
  }
  return connection;
}

CustomRenderer.prototype.getShapePath = function (parentNode, element) {
  return this.bpmnRenderer.getShapePath(parentNode, element);
};

