
// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = JSON.parse(dropdownMenu.property("value"));
  console.log(dataset)
  updateMetadata(dataset.bio)

  var samplevalues = dataset.samples_data.sample_values
  var otuids = dataset.samples_data.otu_ids
  var otulables = dataset.samples_data.otu_labels

  // Slice the top 10
  var top10_samplevalues = samplevalues.slice(0, 10);
  // Returns elements at index position 0 and 10, but not 11.
  console.log(top10_samplevalues);
  // Slice the top 10
  var top10_otuids = otuids.slice(0, 10).map(row => "OTU" + " " + row);
  // Returns elements at index position 0 and 10, but not 11.
  console.log(top10_otuids);
  // Slice the top 10
  var top10_otulables = otulables.slice(0, 10).map(row => "OTU" + " " + row);
  // Returns elements at index position 0 and 10, but not 11.
  console.log(top10_otulables);

  // Build a Bar Chart using the sample data
  var bar_chart = {
    x: top10_samplevalues,
    y: top10_otuids,
    // y: `OTU Ids ${otuids}`,
    // text: data.samples.otu_labels,
    type: "bar",
    orientation: 'h'
  };

  // Create data1 array
  var data1 = [bar_chart];

  // Apply the group barmode to layout1
  var layout1 = {
    title: "Top 10 OTUs Found",
    barmode: "group"
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", data1, layout1);


  //Build a Bubble Chart using the sample data
  var bubble_chart = {
    x: otuids,
    y: samplevalues,
    text: otulables,
    type: "scatter",
    mode: "markers",
    marker: {
      color: otuids,
      size: samplevalues,
    },
  };

  // Create data2 array
  var data2 = [bubble_chart];

  // Apply the group bubblemode to layout2
  var layout2 = {
    title: "Biodiversity of Sample",
    xaxis: {
      title: "OTU ID",
    },
    yaxis: {
      title: "Value",
      range: [0, Math.max(samplevalues)]
    }
  };
  
  // Render the plot to the div tag with id "bubble"
  Plotly.newPlot("bubble", data2, layout2);
}

// This function is called when a dropdown menu item is selected
function updateMetadata(metadata) {
  // var metadata = dataset.bio
  // Use d3 to select the panel with id of `#sample-metadata`
  var selector = d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  selector.html("")

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(metadata).forEach(([key, value]) => {

    // add a new line
    selector.append("p").text(`${key}: ${value}`);
  });
}

// Fetch the JSON data and console log it
d3.json("samples.json").then(function (data) {
  console.log(data);
  console.log(data.samples);
  var metadata_samples = []
  for (i in data.samples) {
    metadata_samples.push({
      bio: data.metadata[i],
      samples_data: data.samples[i]
    })
  }

  var dropdownMenu = d3.select("#selDataset");
  dropdownMenu.selectAll("option").data(metadata_samples)
    .enter().append("option")
    .attr("value", function (d) { return JSON.stringify(d); })
    .text(function (d) {
      return d.samples_data.id
    });

//Call updatePlotly() when a change takes place to the DOM
  dropdownMenu.on("change", updatePlotly);
  // dropdownMenu.on("change", updateMetadata(dataset.bio));
  updatePlotly() 

});




