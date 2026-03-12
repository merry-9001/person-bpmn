import {
  TextFieldEntry,
  isTextFieldEntryEdited,
} from "@bpmn-io/properties-panel";

import { html } from "htm/preact";

import { useService } from "bpmn-js-properties-panel";

export default function spellProps(element) {
  return [
    {
      id: "spell",
      element,
      component: Spell,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

function Spell(props) {
  const { element, id } = props;

  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  function getValue() {
    return element.businessObject.spell || "";
  }

  function setValue(value) {
    modeling.updateProperties(element, {
      spell: value,
    });
  }

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Apply a black magic spell")}
    label=${translate("Spell")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
    tooltip=${translate("Check available spells in the spellbook.")}
  />`;
}
