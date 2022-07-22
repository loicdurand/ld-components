const // 

    updateAttribute = (element, attribute, value) => {

        const eventListener = (event) => event.currentTarget.events[event.type](event);

        if (attribute === "key" || value === null)
            return;

        if (attribute.startsWith('on')) {
            const event = attribute.slice(2);
            element.events ||= {};
            element.events[event] = value;
            if (value)
                element.addEventListener(event, eventListener);
            else
                element.removeEventListener(event, eventListener);
        } else if (attribute in element && !["list", "type", "draggable", "spellcheck", "translate"].includes(attribute)) {
            element[attribute] = value;
        } else if (value !== false) {
            element.setAttribute(attribute, value)
        }

        if (value == null || value === false) {
            element.removeAttribute(attribute)
        }

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
    };

export { wireStateToActions, resolveNode, render };

