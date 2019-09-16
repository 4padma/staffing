// import faker from "faker";

function createFakeRow(index) {
    return {
        directors: 'D' + index,
        openPositions: 10 + index,
        offerReleased: 5 + index,
        closedPositions: 15 + index
    }
}


function createFakeChildRow(index) {
    return {
        directors: 'M' + index,
        openPositions: 2 + index,
        offerReleased: 3 + index,
        closedPositions: 10 + index
    }
}

const createChildRows = count => {
    return [...Array(count).keys()].map(i => createFakeChildRow(i));
};
export default function createRowData(count) {
    return [...Array(count).keys()].map(i => {
        const teamMembers = createChildRows(3);
        return { ...createFakeRow(i), teamMembers };
    });
}
