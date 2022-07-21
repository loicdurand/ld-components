export const // 

    clone = (target, source) => ({ ...target, ...source }),

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

    recycleElement = (element) => ({
        nodeName: element.nodeName.toLowerCase(),
        attributes: {},
        children: element.childNodes.map(element => {
            return element.nodeType === 3 // Node.TEXT_NODE
                ? element.nodeValue
                : recycleElement(element)
        })
    }),

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
    };