// Initialize Mermaid
mermaid.initialize({ startOnLoad: false });

// Global variables
let currentSourceNode;
let nodeCounter = {};

// Generate and render the Mermaid diagram
function generateDiagram() {
  const input = document.getElementById("input").value;
  mermaid.render("mermaid-diagram", input, function (svgCode) {
    document.getElementById("diagram").innerHTML = svgCode;
    addNodeListenersNewStep();
  });
}

// Add click listeners to nodes
function addNodeListenersNewStep() {
  document.querySelectorAll(".node").forEach((node) => {
    node.addEventListener("click", () => {
      currentSourceNode = node.id.replace(/^flowchart-/, "");
      document.getElementById("modal").style.display = "block";
    });
  });
}

function removeNodeListenersNewStep() {
  document.querySelectorAll(".node").forEach((node) => {
    node.removeEventListener("click", () => {
      currentSourceNode = node.id.replace(/^flowchart-/, "");
      document.getElementById("modal").style.display = "block";
    });
  });
}

// Add a new step to the diagram
// graph TD;
//     A[Start] --> B[End];
//     A --> A-1[asdf]
// Clicking on A-1 will add a new step after A-1
// graph TD;
//     A[Start] --> B[End];
//     A --> A-1[asdf]
//     A-1 --> A-1-1[asdf]
function addStep() {
  const newStep = document.getElementById("newStep").value.trim();
  if (newStep && currentSourceNode) {
    const input = document.getElementById("input");
    const lines = input.value.split("\n");

    // Remove dash number from source node in the generated DOM
    const baseSourceNode = currentSourceNode.split("-").slice(0, -1).join("-");

    // Initialize or increment counter for this node
    nodeCounter[baseSourceNode] = (nodeCounter[baseSourceNode] || 0) + 1;
    const newNodeId = `${baseSourceNode}-${nodeCounter[baseSourceNode]}`;

    // Add new node to the diagram
    lines.push(`    ${baseSourceNode} --> ${newNodeId}[${newStep}]`);
    input.value = lines.join("\n");

    generateDiagram();
    closeNewStepModal();
  }
}

// Close the newStepModal
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("newStep").value = "";
}

// Initial diagram generation
generateDiagram();
