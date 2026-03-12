// 引入默认的renderer
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { 
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove
} from "tiny-svg"
import inherits from 'inherits-browser';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

export default function CustomRenderer(eventBus, bpmnRenderer) { 
  BaseRenderer.call(this, eventBus, HIGH_PRIORITY);
  this.bpmnRenderer = bpmnRenderer;

  this.drawCustomElement = function (parentNode, element) { 
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    if (is(element, 'bpmn:Task')) { 
      const rect = drawRect(parentNode, 100, 48, 2, '#ff0000');

      prependTo(rect, parentNode);

      svgRemove(shape);

      return shape;
    }

    return shape;
  }
  
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

CustomRenderer.prototype.canRender = function (element) { 
  return !element.labelTarget;
}

CustomRenderer.prototype.drawShape = function (parentNode, element) { 
  return this.drawCustomElement(parentNode, element);
}

CustomRenderer.prototype.getShapePath = function (parentNode, element) {
  return this.bpmnRenderer.getShapePath(parentNode, element);
}

function drawRect(parentNode, width, height, borderRadius, strokeColor) {
  const rect = svgCreate("rect");
  svgAttr(rect, {
    width,
    height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor,
    strokeWidth: 2,
    fill: "#fff"
  });
  svgAppend(parentNode, rect);
  return rect;
}

function prependTo(newNode, parentNode, siblingNode) { 
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
} 