/**
 * Sample diagram fixtures for testing LLM integration
 */

const sampleDiagrams = {
    // Simple flowchart diagram
    simpleFlowchart: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2024-01-15T10:30:00.000Z" agent="Mozilla/5.0" version="22.1.0" type="device">
  <diagram name="Simple Flowchart" id="diagram-1">
    <mxGraphModel dx="1234" dy="694" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="start-1" value="Start" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="200" y="50" width="100" height="60" as="geometry" />
        </mxCell>
        <mxCell id="process-1" value="Process Data" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="175" y="150" width="150" height="60" as="geometry" />
        </mxCell>
        <mxCell id="decision-1" value="Is Valid?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="187.5" y="250" width="125" height="80" as="geometry" />
        </mxCell>
        <mxCell id="end-success" value="Success" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="100" y="380" width="100" height="60" as="geometry" />
        </mxCell>
        <mxCell id="end-error" value="Error" style="ellipse;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="300" y="380" width="100" height="60" as="geometry" />
        </mxCell>
        <mxCell id="edge-1" edge="1" parent="1" source="start-1" target="process-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-2" edge="1" parent="1" source="process-1" target="decision-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-3" value="Yes" edge="1" parent="1" source="decision-1" target="end-success">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-4" value="No" edge="1" parent="1" source="decision-1" target="end-error">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,

    // Network architecture diagram
    networkArchitecture: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2024-01-15T11:00:00.000Z" agent="Mozilla/5.0" version="22.1.0" type="device">
  <diagram name="Network Architecture" id="diagram-2">
    <mxGraphModel dx="1234" dy="694" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="client-1" value="Web Client" style="shape=mxgraph.aws3.android;html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="50" y="100" width="80" height="80" as="geometry" />
        </mxCell>
        <mxCell id="lb-1" value="Load Balancer" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="200" y="110" width="120" height="60" as="geometry" />
        </mxCell>
        <mxCell id="server-1" value="API Server 1" style="shape=mxgraph.aws3.ec2;html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="400" y="50" width="80" height="80" as="geometry" />
        </mxCell>
        <mxCell id="server-2" value="API Server 2" style="shape=mxgraph.aws3.ec2;html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="400" y="160" width="80" height="80" as="geometry" />
        </mxCell>
        <mxCell id="db-1" value="Database" style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="560" y="100" width="80" height="80" as="geometry" />
        </mxCell>
        <mxCell id="edge-c1-lb" edge="1" parent="1" source="client-1" target="lb-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-lb-s1" edge="1" parent="1" source="lb-1" target="server-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-lb-s2" edge="1" parent="1" source="lb-1" target="server-2">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-s1-db" edge="1" parent="1" source="server-1" target="db-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="edge-s2-db" edge="1" parent="1" source="server-2" target="db-1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,

    // Multi-page diagram
    multiPage: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2024-01-15T12:00:00.000Z" agent="Mozilla/5.0" version="22.1.0" type="device">
  <diagram name="Overview" id="page-1">
    <mxGraphModel dx="1234" dy="694" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="overview-1" value="System Overview" style="rounded=1;whiteSpace=wrap;html=1;fontSize=16;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="200" height="80" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
  <diagram name="Details" id="page-2">
    <mxGraphModel dx="1234" dy="694" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="detail-1" value="Component A" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="120" height="60" as="geometry" />
        </mxCell>
        <mxCell id="detail-2" value="Component B" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="300" y="100" width="120" height="60" as="geometry" />
        </mxCell>
        <mxCell id="edge-d1-d2" edge="1" parent="1" source="detail-1" target="detail-2">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,

    // Empty diagram
    emptyDiagram: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2024-01-15T13:00:00.000Z" agent="Mozilla/5.0" version="22.1.0" type="device">
  <diagram name="Empty Diagram" id="empty-1">
    <mxGraphModel dx="1234" dy="694" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,

    // Diagram with HTML-formatted text
    htmlFormattedText: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2024-01-15T14:00:00.000Z" agent="Mozilla/5.0" version="22.1.0" type="device">
  <diagram name="Formatted Text" id="formatted-1">
    <mxGraphModel dx="1234" dy="694" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="html-1" value="&lt;b&gt;Bold Title&lt;/b&gt;&lt;br&gt;&lt;i&gt;Italic subtitle&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="200" height="80" as="geometry" />
        </mxCell>
        <mxCell id="html-2" value="Item with &amp;lt;special&amp;gt; &amp;amp; characters" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="100" y="220" width="200" height="60" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`,

    // Invalid XML for error testing
    invalidXml: `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net">
  <diagram name="Invalid">
    <mxGraphModel>
      <root>
        <mxCell id="0"
        <!-- Missing closing tag -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`
};

module.exports = { sampleDiagrams };
