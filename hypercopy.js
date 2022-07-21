import { resolveNode, wireStateToActions, createElement } from './utils';
let i = 0
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

    let //
      lifecycle = [],
      skipRender = true,
      isRecycling = true,
      rootElement = (container && container.children[0]) || null;

    actions = wireStateToActions(state, actions);

    requestAnimationFrame(() => {
      skipRender = !skipRender;

      const //
        patch = (parent, node) => {
          const { element: newElement, lifecycle:cycle } = createElement(node, state, actions);
          lifecycle = cycle;
          parent.insertBefore(newElement, null)
        },
        node = resolveNode(view, state, actions);

      if (container && !skipRender)
        rootElement = patch(container, node);

      isRecycling = false;

      lifecycle.forEach(cycle=>cycle());

    });

  }
