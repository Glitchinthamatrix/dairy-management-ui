export function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

export function getFieldValue(obj, field) {
  let value = null;
  if (field.includes(".")) {
    const fields = field.split(".");
    for (let field of fields) {
      value = obj ? obj[field] : null;
      obj = value;
      if (value === null) {
        break;
      }
    }
  } else {
    value = obj ? obj[field] : null;
  }
  return value;
}
