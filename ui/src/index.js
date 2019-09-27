import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactDataGrid from "react-data-grid";
import createRowData from "./createRowData";
import { Data } from "react-data-grid-addons";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
// import 'jquery/src/jquery.js';
// import { Container, Row } from 'react-bootstrap';
import "./styles.css";
// import Header from './Header';

const defaultColumnProperties = {
    width: 160
};

const columns = [
    {
        key: "directors",
        name: "Directors"
    },
    {
        key: "openPositions",
        name: "Open Positions"
    },
    {
        key: "offerReleased",
        name: "Offer Released"
    },
    {
        key: "closedPositions",
        name: "Closed Positions"
    }
].map(c => ({ ...c, ...defaultColumnProperties }));

const ROW_COUNT = 3;

// const groupBy = ["jobType"];

const getSubRowDetails = expandedRows => rowItem => {
    const isExpanded = expandedRows[rowItem.id]
        ? expandedRows[rowItem.id]
        : false;
    return {
        group: rowItem.teamMembers && rowItem.teamMembers.length > 0,
        expanded: isExpanded,
        children: rowItem.teamMembers,
        field: "directors",
        treeDepth: rowItem.treeDepth || 0,
        siblingIndex: rowItem.siblingIndex,
        numberSiblings: rowItem.numberSiblings
    };
};

function updateSubRowDetails(subRows, parentTreeDepth) {
    const treeDepth = parentTreeDepth || 0;
    subRows.forEach((sr, i) => {
        sr.treeDepth = treeDepth + 1;
        sr.siblingIndex = i;
        sr.numberSiblings = subRows.length;
    });
}

const onCellExpand = args => ({ rows, expandedRows }) => {
    const rowKey = args.rowData.id;
    const rowIndex = rows.indexOf(args.rowData);
    const subRows = args.expandArgs.children;
    if (expandedRows && !expandedRows[rowKey]) {
        expandedRows[rowKey] = true;
        updateSubRowDetails(subRows, args.rowData.treeDepth);
        rows.splice(rowIndex + 1, 0, ...subRows);
    } else if (expandedRows[rowKey]) {
        expandedRows[rowKey] = false;
        rows.splice(rowIndex + 1, subRows.length);
    }
    return { expandedRows, rows };
};

function Example({ rows }) {
    const [state, setState] = useState({ expandedRows: {}, rows });
    const visibleRows = Data.Selectors.getRows(state);
    return (
        // <Card style={{ width: '65rem', height: '10rem' }}>
        //     <Card.Body>
        <div>
            <div>
                <ReactDataGrid
                    columns={columns}
                    rowGetter={i => visibleRows[i]}
                    rowsCount={visibleRows.length}
                    minHeight={350}
                    getSubRowDetails={getSubRowDetails(state.expandedRows)}
                    onCellExpand={args => setState(onCellExpand(args))}
                />
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Example rows={createRowData(ROW_COUNT)} />, rootElement);
