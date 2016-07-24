var React = require("react");
var ReactDOM = require("react-dom");
var Button = require("../Button.jsx");

function handleButtonClick() {
    console.log("ok");
}

ReactDOM.render(
    <Button title="&raquo;" onClick={handleButtonClick}/>,
    document.getElementById("contents")
);
