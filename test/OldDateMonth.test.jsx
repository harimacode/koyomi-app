var React = require("react");
var ReactDOM = require("react-dom");
var OldDateMonth = require("../OldDateMonth.jsx");

var date = new Date();
function moveDays(days) {
    var t = date.getTime();
    t += (24 * 60 * 60 * 1000) * days;
    date.setTime(t);
    renderOldDateMonth();
}
function prev() {
    moveDays(-1);
}
function today() {
    date = new Date();
    renderOldDateMonth();
}
function next() {
    moveDays(+1);
}

function renderOldDateMonth() {
    ReactDOM.render(
        <OldDateMonth date={date}
                    subtitle="2行目"
                    onPrevClick={prev}
                    onCurrentClick={today}
                    onNextClick={next} />,
        document.getElementById("contents")
    );
}
renderOldDateMonth();
