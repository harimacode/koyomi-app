import React from "react";

export default class Toolbar extends React.Component {
    render() {
        return (
            <div className="toolbar">
                <a href="#六輝" className="box"><div className="title">六輝</div><div className="rokki"></div></a>
                <a href="#干支" className="box"><div className="title">干支</div><div className="eto"></div></a>
                <a href="#九星" className="box"><div className="title">九星</div><div className="kyusei"></div></a>
                <a href="#直" className="box"><div className="title">直</div><div className="choku"></div></a>
                <a href="#宿" className="box"><div className="title">宿</div><div className="shuku"></div></a>
                <a href="#納音" className="box"><div className="title">納音</div><div className="nattin"></div></a> 
            </div>
        );
    }
}
