import {React} from "react";
import {ReactDOM} from "react-dom";

module.exports = React.createClass({
    render: function () {
        var name = this.props.name;
        var rows = this.props.items.map(function (aItem) {
            var title = aItem[0];
            if (!Array.isArray(title)) {
                title = [title, title];
            }
            var reading = aItem[1];
            var desc = aItem[2];
            var id = name + '_' + title[0];
            var titleHtml = (
                <span id={id}>{title[1]}</span>
            );
            if (reading) {
                titleHtml = (
                    <div>
                        <div className="explanation-table__title-ruby">{reading}</div>
                        {titleHtml}
                    </div>
                );
            }
            return (
                <tr key={id}>
                    <th className="explanation-table__title-cell">{titleHtml}</th>
                    <td className="explanation-table__text-cell">{desc}</td>
                </tr>
            );
        });
        return (
            <table className="explanation-table">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});
