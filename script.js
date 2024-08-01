// Global variables
let currentSourceNode;
let nodeCounter = {};

// ========================================================================================
// Diagram render

function generateDiagram() {
  // Generate and render the Mermaid diagram
  const input = document.getElementById("input").value;

  const themeColor = getControlGroupConfigById("themeColor").value;

  mermaid.render("mermaid-diagram", input, function (svgCode) {
    document.getElementById("diagram").innerHTML = svgCode;

    addNodeListenersNewStep();

    const svg = document.getElementById("diagram").querySelector("svg");
    if (svg) {
      svg.style.backgroundColor = `${themeColor}65`;
    }
  });
}

// ========================================================================================
// Interactivity - Add new steps from the clicked node

function handleNodeClick(event, node) {
  currentSourceNode = node.id.replace(/^flowchart-/, "");
  document.getElementById("modal").style.display = "block";
}

function addNodeListenersNewStep() {
  const diagram = document.getElementById("diagram");
  // Add click listeners to nodes
  const nodes = diagram.querySelectorAll(".node");

  nodes.forEach((node) => {
    node.addEventListener("click", (e) => handleNodeClick(e, node));
  });
}

function disableNodeClickEvents() {
  const nodes = document.querySelectorAll(".node");
  nodes.forEach((node) => {
    node.removeEventListener("click", handleNodeClick);
  });
}

function addStep() {
  // Add a new step to the diagram using the text in the newStep input
  // graph TD;
  //     A[Start] --> B[End];
  //     A --> A-1[asdf]
  // Clicking on A-1 will add a new step after A-1
  // graph TD;
  //     A[Start] --> B[End];
  //     A --> A-1[asdf]
  //     A-1 --> A-1-1[asdf]
  const newStep = document.getElementById("newStep").value.trim();

  console.log(newStep);
  console.log(currentSourceNode);
  if (newStep && currentSourceNode) {
    const input = document.getElementById("input");
    console.log(input);
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
  }
  closeModal();
}

function closeModal() {
  // Close the newStepModal
  document.getElementById("modal").style.display = "none";
  document.getElementById("newStep").value = "";
}

// ========================================================================================

// Controls

const controlGroupConfig = [
  {
    id: "themeColor",
    label: "Theme Color",
    value: localStorage.getItem("themeColor") || "#000000",
  },
  {
    id: "nodeFillColor",
    label: "Node Fill Color",
    value: localStorage.getItem("nodeFillColor") || "#e93a3a",
  },
  {
    id: "nodeStrokeColor",
    label: "Node Stroke Color",
    value: localStorage.getItem("nodeStrokeColor") || "#000000",
  },
  {
    id: "edgeColor",
    label: "Edge Color",
    value: localStorage.getItem("edgeColor") || "#000000",
  },
  {
    id: "textColor",
    label: "Text Color",
    value: localStorage.getItem("textColor") || "#000000",
  },
];

function getControlGroupConfigById(id) {
  return controlGroupConfig.find((config) => config.id === id);
}

function updateConfigValue(id, value) {
  const config = getControlGroupConfigById(id);
  config.value = value;
  localStorage.setItem(id, value);
  generateInitialMermaidDiagram();
  generateDiagram();
}

function buildControlGroup(input) {
  const controlGroup = document.createElement("div");
  controlGroup.classList.add("control-group");
  controlGroup.style.display = "flex";
  controlGroup.style.flexDirection = "column";
  controlGroup.style.alignItems = "center";
  controlGroup.style.justifyContent = "space-between";

  const label = document.createElement("label");
  label.setAttribute("for", input);
  label.textContent = input.charAt(0).toUpperCase() + input.slice(1);

  const inputElement = document.createElement("input");
  inputElement.type = "color";
  inputElement.id = input;
  inputElement.value = localStorage.getItem(input) || "#000000";
  inputElement.addEventListener("input", () => {
    updateConfigValue(input, inputElement.value);
  });
  inputElement.addEventListener("change", () => {
    updateConfigValue(input, inputElement.value);
  });

  controlGroup.appendChild(label);
  controlGroup.appendChild(inputElement);
  return controlGroup;
}

function generateControlGroup() {
  const controlGroup = document.getElementById("control-group");
  controlGroup.innerHTML = "";
  controlGroup.style.display = "flex";
  controlGroup.style.flexDirection = "row";
  controlGroup.style.alignItems = "center";
  controlGroup.style.justifyContent = "space-between";
  controlGroupConfig.forEach((config) => {
    const controlGroupItem = buildControlGroup(config.id);
    controlGroup.appendChild(controlGroupItem);
  });
}
// ========================================================================================

// MAIN START

// Initial data

function generateInitialMermaidDiagram() {
  const diagramText = `graph TD;
    classDef default fill:${
      getControlGroupConfigById("nodeFillColor").value
    },stroke:${getControlGroupConfigById("nodeStrokeColor").value},color:${
    getControlGroupConfigById("textColor").value
  }
    linkStyle default stroke:${
      getControlGroupConfigById("edgeColor").value
    },color:${getControlGroupConfigById("textColor").value}
    A[Start: Meeting Scheduled] --> B[Prepare Internal Team]
    B --> C[Create Meeting Agenda]
    C --> D[Prepare Necessary Documents]
    D --> E{Ask Customer for Questions}
    E -->|Yes| F[Incorporate Customer Questions]
    E -->|No| G[Internal Team Sync]
    F --> G
    G --> H{All Prepared?}
    H -->|No| I[Address Outstanding Items]
    I --> G
    H -->|Yes| J[Have the Meeting]
    J --> K{Meeting Successful?}
    K -->|Yes| L[Follow Up After Meeting]
    K -->|No| M[Reschedule Meeting]
    L --> N[Document Product Requests]
    N --> O[Assign Action Items]
    O --> P[Schedule Next Steps]
    P --> Q[End: Meeting Cycle Complete]
    M --> R[Identify Reason for Rescheduling]
    R --> S[Set New Date]
    S --> T[Notify Participants]
    T --> U[Gather Feedback from Participants]
    U --> V[Analyze Feedback]
    V --> W{Feedback Actionable?}
    W -->|Yes| X[Implement Feedback]
    W -->|No| Y[Document Feedback for Future]
    X --> Z[Update Process]
    Z --> AA[End: Feedback Cycle Complete]
    Y --> AA
`;

  document.getElementById("input").value = diagramText;
}

// ========================================================================================

// Main
// Initialize Mermaid
function initializeMermaid() {
  // var curveType = curveSwitch.checked ? 'basis' : 'linear';
  var curveType = "basis";
  var config = {
    startOnLoad: false,
    theme: "base",
    securityLevel: "loose",
    flowchart: {
      curve: curveType,
    },
  };
  mermaid.initialize(config);
  generateDiagram();
}

generateInitialMermaidDiagram();
generateControlGroup();
initializeMermaid();
