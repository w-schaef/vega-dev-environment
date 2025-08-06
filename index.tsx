/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Since vega-embed is loaded from a script tag in index.html, 
// we need to declare it to TypeScript to avoid compilation errors.
declare const vegaEmbed: any;

async function renderChart() {
  const visContainer = document.getElementById('vis');
  if (!visContainer) {
    console.error('Container element #vis not found.');
    return;
  }

  try {
    // To solve the "CORS" issue when loading from a local filesystem,
    // we will fetch the data file ourselves and inject it into the Vega spec
    // before rendering. This avoids making Vega fetch a `file://` URL,
    // which is blocked by browser security policies.
    const [specResponse, dataResponse] = await Promise.all([
      fetch('chart.vg.json'),
      fetch('data.json'),
    ]);

    if (!specResponse.ok) {
      throw new Error(`HTTP error! status: ${specResponse.status}`);
    }
    if (!dataResponse.ok) {
        throw new Error(`HTTP error! status: ${dataResponse.status}`);
    }
    
    const vegaSpec = await specResponse.json();
    const chartData = await dataResponse.json();
    
    // Find data sources in the spec that use the external file and replace
    // the 'url' with an inline 'values' property.
    if (vegaSpec.data && Array.isArray(vegaSpec.data)) {
        vegaSpec.data.forEach((source: any) => {
            if (source.url === './data.json') {
                delete source.url;
                // The spec uses `format.property` to pluck 'nodes' or 'links'.
                if (source.format && source.format.property) {
                    source.values = chartData[source.format.property];
                    // The format property is no longer needed since data is inline.
                    delete source.format;
                }
            }
        });
    }
    
    // Embed the visualization in the container with id 'vis'.
    // The spec now has data embedded, so no external fetch will occur.
    await vegaEmbed('#vis', vegaSpec, { actions: false });
    console.log('Vega chart rendered successfully.');

  } catch (error) {
    console.error('Error loading or rendering Vega chart:', error);
    visContainer.innerHTML = `<p style="color: red; padding: 1rem;">Failed to load chart. See browser console for details.</p>`;
  }
}

// Run the rendering function when the document is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderChart);
} else {
  renderChart();
}