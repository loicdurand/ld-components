import { wireStateToActions, resolveNode, render } from './utils';

let random = Math.floor(Math.random() * 1e3);

const style = document.createElement("style");
style.rel = "stylesheet";
style.innerText = '';
document.head.appendChild(style);

export default ({ stylesheet, ...collection }) => {

    const //
        getRegExp = cpnt => new RegExp(cpnt + '|[^\da-zA-Z#\.]' + cpnt + '{1}[^\da-zA-Z]', 'gm'),
        refs = {},
        Collection = typeof collection === 'object' ? ($this) => collection : collection,
        output = {},
        mergeClasses = cpnt => (attributes = {}, children = attributes.children) => {
            const // 
                nodeName = Collection(output)[cpnt],
                elt = typeof nodeName == 'string' ? h(nodeName, attributes, children) : nodeName(attributes, children);
            for (const prop in attributes)
                elt.attributes[prop] = attributes[prop];
            elt.attributes.class = [elt.attributes.class, refs[cpnt]]
                .filter(Boolean)
                .join(" ");
            return h(elt.nodeName, elt.attributes, elt.children);
        };

    for (const cpnt in Collection(output)) {
        const id = `L${random++}`;
        stylesheet = stylesheet.replace(getRegExp(cpnt), m => m.replace(new RegExp(cpnt), '.' + id));
        refs[cpnt] = id;
        output[cpnt] = mergeClasses(cpnt);
    }

    style.innerText += stylesheet;

    return output;
};

export const //

    h = (name, attributes, ...nodes) => {

        const children = nodes.flat();

        if (typeof name === "function")
            return name(attributes || {}, children);

        return {
            nodeName: name,
            attributes: attributes || {},
            children,
            key: attributes && attributes.key
        };

    },

    app = (state, actions, view, container) => {

        actions = wireStateToActions(state, actions);
        view = resolveNode(view, state, actions);
        render(state, actions, view, container)
            .then(createEvents => createEvents.forEach(event => event()));

    };