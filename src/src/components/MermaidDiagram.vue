<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import mermaid from "mermaid";

const props = defineProps({
  diagram: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["nodeClick"]);

const diagramDiv = ref(null);

function insertSvg(svgCode, bindFunctions) {
  diagramDiv.value.innerHTML = svgCode;
  bindFunctions(diagramDiv.value);
}

function renderDiagram() {
  mermaid.mermaidAPI.render("diagram", props.diagram, insertSvg);
}

watch(
  () => props.diagram,
  () => renderDiagram()
);

onMounted(() => {
  mermaid.mermaidAPI.initialize({
    securityLevel: "loose",
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      lineColor: "#999999",
    },
  });

  window.mermaidClick = (id) => {
    emit("nodeClick", id);
  };

  renderDiagram();
});

onUnmounted(() => {
  delete window.mermaidClick;
});
</script>

<template>
  <div ref="diagramDiv" class="flex justify-center"></div>
</template>
