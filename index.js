import { h } from 'hyperapp'
import picostyle from "picostyle"
const style = picostyle(h);

export class Component {
    constructor(o) {
        o.style = o.style || function () {
            return {};
        };
        if (o)
            return style(o.jsx)(o.style);
        else
            return this;
    }
}
