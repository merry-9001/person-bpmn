// 引入默认的renderer
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { 
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove
} from "tiny-svg"

import { customElements, customConfig } from '@/components/utils/util';
import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer { 
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) { 
    return !element.labelTarget;
  }

  // drawShape(parentNode, element) { 
  //   // 获取类型
  //   const type = element.type;
  //   console.log(type);
  //   if (customElements.includes(type)) {
  //     const { url, attr } = customConfig[type];
  //     const customIcon = svgCreate('image', {
  //       ...attr,
  //       href: url
  //     });

  //     element["width"] = attr.width;
  //     element["height"] = attr.height;

  //     svgAppend(parentNode, customIcon);
  //     return customIcon;
  //   }

  //   const shape = this.bpmnRenderer.drawShape(parentNode, element);
  //   return shape;
  // }
  
  drawShape(parentNode, element) { 
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    if (is(element, 'bpmn:Task')) { 
      const rect = drawRect(parentNode, 100, 48, 2, '#ff0000');

      prependTo(rect, parentNode);

      svgRemove(shape);

      return shape;
    }

    return shape;
  }

  getShapePath(shape) { 
    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

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