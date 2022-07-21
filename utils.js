export const // 

    updateAttribute = (element, name, value, isSvg) => {

        const eventListener = (event) => event.currentTarget.events[event.type](event);

        if (name === "key" || value === null)
            return;

        if (name.startsWith('on')) {

            name = name.slice(2);
            element.events ||= {};
            element.events[name] = value;
            if (value)
                element.addEventListener(name, eventListener);
            else
                element.removeEventListener(name, eventListener);

        } else if (
            name in element &&
            name !== "list" &&
            name !== "type" &&
            name !== "draggable" &&
            name !== "spellcheck" &&
            name !== "translate" &&
            !isSvg
        ) {
            element[name] = value;
        } else if (value !== false) {
            element.setAttribute(name, value)
        }

        if (value == null || value === false) {
            element.removeAttribute(name)
        }

    },

    resolveNode = (node, state, actions) => {
        return typeof node === "function"
            ? resolveNode(node(state, actions))
            : node != null
                ? node
                : ""
    },

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

    createElement = (node, state, actions, lifecycle = []) => {
        let // 
            isSvg = false,
            element;
        if (typeof node === "string" || typeof node === "number")
            element = document.createTextNode(node);
        else if (node.nodeName === "svg") {
            element = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            isSvg = true;
        } else {
            element = document.createElement(node.nodeName);

            const { attributes, children } = node;
            if (attributes) {

                children.forEach(child => {
                    const { element: newElement } = createElement(resolveNode(child, state, actions), state, actions, lifecycle);
                    element.appendChild(newElement);
                });

                for (let name in attributes) {
                    if (name === 'oncreate')
                        lifecycle.push(() => attributes.oncreate(element))
                    else
                        updateAttribute(element, name, attributes[name], isSvg);
                }
            }
        }

        return { element, lifecycle };
    };

