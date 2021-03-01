import React, { useRef } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum, SimulationLinkDatum } from "d3";
import { Network, LinkType } from "../../../core/model/network";

export interface SimulationNode extends SimulationNodeDatum {
    id: string;
    name: string;
    color: string;
}

export interface SimulationLink extends SimulationLinkDatum<SimulationNode> {
    name?: string,
    type: LinkType
}

const toSimulationNodes = (network: Network): SimulationNode[] =>
    network.nodes.map(node => ({
        id: node.id,
        name: node.name,
        color: node.color
    }));

const toSimulationLinks = (network: Network): SimulationLink[] =>
    network.links.map(link => ({
        source: link.source.id,
        target: link.target.id,
        color: link.color,
        type: link.type
    }));

const toSimulation = (network: Network) =>
    ({ nodes: toSimulationNodes(network), links: toSimulationLinks(network) });


const NetworkDiagram = (props) => {
    const ref = useRef();
    let simulationNetwork = toSimulation(props.network);
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .style("margin", "0px auto 0px auto")
        .style("padding", "2px")
        .style("font", "12px sans-serif bold")
        .style("border", "0px").style("border-radius", "8px")
        .style("pointer-events", "none");
    let svg = d3.select(ref.current),
        width = 1000,
        height = 1000;
    svg.selectAll("*").remove();
    svg.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", 12)
        .attr("refY", 6)
        .attr("markerWidth", 20)
        .attr("markerHeight", 20)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "black");
    let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(simulationNetwork.links)
        .enter().append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(simulationNetwork.nodes)
        .enter()
    let node_points = node.append("circle")
        .attr("r", 5)
        .attr("fill", "red")
    let simulation = d3.forceSimulation<SimulationNode>()
        //add nodes
        .nodes(simulationNetwork.nodes)
        .force("charge_force", d3.forceManyBody().strength(-80))
        .force("center_force", d3.forceCenter(width / 2, height / 2))
        .force("links", d3
            .forceLink(simulationNetwork.links)
            .id(function (d: SimulationNode) { return d.id; }))
        .on("tick", () => {
            node_points
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("fill", function (d) { return d.color });
            link
                .attr("x1", function (d) { return (d.source as SimulationNode).x; })
                .attr("y1", function (d) { return (d.source as SimulationNode).y; })
                .attr("x2", function (d) { return (d.target as SimulationNode).x; })
                .attr("y2", function (d) { return (d.target as SimulationNode).y; })
                .attr("marker-end", (d) => (d as SimulationLink).type === LinkType.USES ? "url(#triangle)" : "")
        });
    // Implement drag
    const dragstarted = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    const dragged = (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    const dragended = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    const showTooltip = (d: SimulationNode) => {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(d.name)
            .style("display", "inline-block")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }
    const hideTooltip = (d: SimulationNode) => {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    }
    node_points.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
    return <svg ref={ref} viewBox="0 0 1000 1000" width="1240" height="1024"></svg>
}

export default NetworkDiagram;