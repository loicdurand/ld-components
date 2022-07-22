let random = Math.floor(Math.random() * 1e3);

const // 

    updateAttribute = (element, attribute, value) => {

        if (value === null)
            return;

        if (attribute.startsWith('on')) {
            const // 
                eventListener = event => event.currentTarget.events[event.type](event),
                event = attribute.slice(2);
            element.events ||= {};
            element.events[event] = value;
            if (value)
                element.addEventListener(event, eventListener);
            else
                element.removeEventListener(event, eventListener);
        } else if (attribute in element && !["list", "type", "draggable", "spellcheck", "translate"].includes(attribute))
            element[attribute] = value;
        else if (value !== false)
            element.setAttribute(attribute, value);

        if (value == null || value === false)
            element.removeAttribute(attribute);

    },

    resolveNode = (node, state, actions) => typeof node === "function" ? resolveNode(node(state, actions)) : node || "",

    wireStateToActions = (state, actions) => {

        for (let action in actions) {
            if (typeof actions[action] !== "function")
                continue; // les actions ne peuvent être QUE des fonctions

            const fn = actions[action];
            actions[action] = data => {

                let result = fn(data);

                if (typeof result === "function")
                    result = result(state, actions);

                return result;
            }

        }

        return actions;
    },

    createElement = (node, state, actions, oncreateEvents = []) => {

        if (typeof node === "string" || typeof node === "number")
            return [document.createTextNode('' + node), []];

        let element;
        if (node.nodeName === "svg")
            element = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        else
            element = document.createElement(node.nodeName);

        const { attributes, children } = node;
        if (attributes) {

            children.forEach(child => {
                const [newElement] = createElement(resolveNode(child, state, actions), state, actions, oncreateEvents);
                element.appendChild(newElement);
            });

            for (let attribute in attributes) {
                if (attribute === 'oncreate')
                    oncreateEvents.push(() => attributes.oncreate(element));
                else
                    updateAttribute(element, attribute, attributes[attribute]);
            }

        }

        return [element, oncreateEvents];
    },

    render = async (state, actions, node, container) => {
        if (!container)
            return [];
        const [newElement, oncreateEvents] = createElement(node, state, actions);
        container.insertBefore(newElement, null);
        return oncreateEvents;
    },

    [style] = createElement({ nodeName: "style", attributes: { rel: 'stylesheet' }, children: [] });

document.head.appendChild(style);

export default ({ stylesheet, ...collection }) => {

    const //        
        refs = {},
        output = {},
        getRegExp = cpnt => new RegExp(cpnt + '|[^\da-zA-Z#\.]' + cpnt + '{1}[^\da-zA-Z]', 'gm'),
        Collection = typeof collection === 'object' ? () => collection : collection,
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

    h = (name, attributes, ...children) => {

        attributes ||= {};
        children = children.flat();

        if (typeof name === "function")
            return name(attributes, children);

        return {
            nodeName: name,
            attributes: attributes,
            children,
        };

    },

    app = (state, actions, view, container) => {

        actions = wireStateToActions(state, actions);
        view = resolveNode(view, state, actions);
        render(state, actions, view, container)
            .then(createEvents => createEvents.forEach(event => event()));

    };