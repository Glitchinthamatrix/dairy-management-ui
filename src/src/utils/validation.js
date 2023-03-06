import { getFieldValue, isObject } from "./object";
import { isUploadFileInfo } from "./naive-ui";

export default {
  // Check if the given value is a object nested inside the form
  // so we can drill into it. Naive-UIs UploadFileInfo is also an
  // object, so avoid drilling into it.
  isNestedFormObject(value) {
    return isObject(value) && !isUploadFileInfo(value);
  },

  initErrors(form, fieldErrors) {
    for (const field in form) {
      fieldErrors[field] = {};
      if (this.isNestedFormObject(form[field])) {
        this.initErrors(form[field], fieldErrors[field]);
      } else {
        this.resetError(fieldErrors[field]);
      }
    }
  },

  setValidationErrors(form, fieldErrors, validationErrors) {
    this.resetErrors(form, fieldErrors);
    validationErrors.forEach((error) => {
      const fieldError = getFieldValue(fieldErrors, error[0].field);
      fieldError.hasError = true;
    });
  },

  setErrors(form, fieldErrors, errors) {
    for (const field in fieldErrors) {
      if (errors) {
        if (this.isNestedFormObject(form[field])) {
          this.setErrors(form[field], fieldErrors[field], errors[field]);
        } else if (errors[field]) {
          fieldErrors[field].validationStatus = "error";
          fieldErrors[field].feedback = errors[field];
          fieldErrors[field].hasError = true;
        }
      } else {
        this.resetError(fieldErrors[field]);
      }
    }
  },

  resetErrors(form, fieldErrors) {
    for (const field in fieldErrors) {
      if (this.isNestedFormObject(form[field])) {
        this.resetErrors(form[field], fieldErrors[field]);
      } else {
        this.resetError(fieldErrors[field]);
      }
    }
  },

  resetError(fieldErrors) {
    fieldErrors.validationStatus = undefined;
    fieldErrors.feedback = undefined;
    fieldErrors.hasError = false;
  },
};
