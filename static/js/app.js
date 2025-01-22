// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.find(sampleObj => sampleObj.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    if (result) {
      let sampleValues = result.sample_values;
      let otuIds = result.otu_ids;
      let otuLabels = result.otu_labels;

    // Build a Bubble Chart
    const trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };

    const bubbleData = [trace2];

    const bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      showlegend: false
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const top10SampleValues = sampleValues.slice(0, 10).reverse();
    const top10OtuIds = otuIds.slice(0, 10).reverse();
    const top10OtuLabels = otuLabels.slice(0, 10).reverse();
    const yticks = top10OtuIds.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const trace1 = {
      x: top10SampleValues,
      y: yticks,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h" // Horizontal bar chart
    };

    const data = [trace1];

    const layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };
  


    // Render the Bar Chart
    Plotly.newPlot("bar", data, layout);
  }
});
}
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    // Build the charts for the first sample by default
    names.forEach((name) => {
      dropdown.append("option")
        .text(name) 
        .property("value", name);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
