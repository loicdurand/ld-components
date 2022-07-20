import { h, app } from 'hyperapp';

let _id = Math.floor(Math.random() * 1e4);

export default ({ stylesheet: css, ...collection }) => {

    const //
        cpntRE = cpnt => new RegExp(cpnt + '|[^\da-zA-Z#\.]' + cpnt + '{1}[^\da-zA-Z]', 'gm'),
        style = document.createElement("style"),
        refs = {},
        Collection = typeof collection === 'object' ? ($this) => collection : collection,
        output = {},
        mergeClasses = cpnt => (attributes = {}, children = attributes.children) => {
            const // 
                nodeName = Collection(output)[cpnt],
                elt = typeof nodeName == 'string' ? h(nodeName, attributes, children) : nodeName(attributes, children);
            for (let prop in attributes)
                elt.attributes[prop] = attributes[prop];
            elt.attributes.class = [elt.attributes.class, refs[cpnt]]
                .filter(Boolean)
                .join(" ");
            return h(elt.nodeName, elt.attributes, elt.children);
        };

    for (let cpnt in Collection(output)) {
        id = 'L' + _id++;
        css = css.replace(cpntRE(cpnt), m => m.replace(new RegExp(cpnt), '.' + id));
        refs[cpnt] = id;
        output[cpnt] = mergeClasses(cpnt);
    }

    style.rel = "stylesheet";
    style.innerText = css;
    document.head.appendChild(style);
    return output;
};

export { h, app };