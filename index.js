import {
    h
} from 'hyperapp'
import picostyle, {
    keyframes
} from "picostyle"
const style = picostyle(h);

export class Komponent {
    constructor(o) {
        o.style = o.style || function () {
            return {};
        };
        if (o) {
            const component = style(o.jsx)(o.style)
            if (o.script) {
                component.onCreated = o.script();
                return component
            } else {
                return style(o.jsx)(o.style)
            }
        } else {
            return this;
        }
    }
}