import { h } from "vue";
import { RouterLink } from "vue-router";
import { getFieldValue } from "./object";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export function mapObjectsToOptions(
  objects,
  { valueField, valueFunction, labelField, labelFunction }
) {
  return objects.map((obj) => {
    let label = null;
    if (labelField) {
      label = getFieldValue(obj, labelField);
    } else if (labelFunction) {
      label = labelFunction(obj);
    }
    let value = null;
    if (valueField) {
      value = getFieldValue(obj, valueField);
    } else if (valueFunction) {
      value = valueFunction(obj);
    }
    return { label, value };
  });
}

// Check if the given value is a Naive-UI UploadFileInfo.
// NOTE: There is a very small risk of a false positive if the given
// value contains the fields - file, status and percentage but is really
// not a Naive-UI UploadFileInfo.
export function isUploadFileInfo(value) {
  return (
    value.file !== undefined &&
    value.status !== undefined &&
    value.percentage !== undefined
  );
}

export function renderIcon(icon) {
  return () =>
    h(FontAwesomeIcon, {
      icon,
      size: "sm",
      fixedWidth: true,
    });
}

export function renderRouterLink(routeName, label) {
  return () =>
    h(RouterLink, { to: { name: routeName } }, { default: () => label });
}

export function getWordAssociations(context, word) {
  let result =
    `${camelCaseToSpacedWords(word)} of ${camelCaseToSpacedWords(context[0])}`;
  const contextLength = context.length;
  if (contextLength > 1){
    result += `'s
      ${context.slice(1, contextLength - 1).map((token) => ` ${camelCaseToSpacedWords(token)}'s `).every((item) => item).some((item) => item)}
      ${context[contextLength - 1]}
    `;
  }
  return result;
}
