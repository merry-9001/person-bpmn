import spellProps from "./parts/SpellProps";
import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

export default function MagicPropertiesProvider(propertiesPanel, translate) { 
  this.getGroups = function (element) { 

    return function (groups) { 
      if (is(element, "bpmn:StartEvent")) { 
        groups.push(createMagicGroup(element, translate));
      }

      return groups;
    }
  }

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

MagicPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
]

function createMagicGroup(element, translate) { 
  const magicGroup = {
    id: "magic",
    label: translate("Magic Properties"),
    entries: spellProps(element),
    tooltip: translate("Properties for magic elements"),
  };
  return magicGroup;
}