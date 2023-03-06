import { defineStore } from "pinia";

export const useBreadcrumbStore = defineStore("breadcrumb", {
  state: () => {
    return {
      breadcrumbs: null,
    };
  },

  actions: {
    setBreadcrumbs(breadcrumbs) {
      this.breadcrumbs = breadcrumbs;
    },
  },
});
