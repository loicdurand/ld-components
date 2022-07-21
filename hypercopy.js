import {
  clone, updateAttribute, recycleElement, resolveNode, wireStateToActions
} from './utils';


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
      skipRender,
      isRecycling = true,
      rootElement = (container && container.children[0]) || null;

    const //
      lifecycle = [],
      globalState = clone(state),
      wiredActions = wireStateToActions(globalState, clone(actions));

    scheduleRender();

    return wiredActions;

    function render() {
      skipRender = !skipRender;

      const //
        patch = (parent, node) => parent.insertBefore(createElement(node), null),
        node = resolveNode(view, globalState, wiredActions);

      if (container && !skipRender)
        rootElement = patch(container, node);

      isRecycling = false;

      lifecycle.forEach(cycle => cycle());
    }

    function scheduleRender() {
      if (!skipRender) {
        skipRender = true;
        requestAnimationFrame(render);
      }
    }

    function createElement(node) {
      let // 
        isSvg = false,
        element;
      if (typeof node === "string" || typeof node === "number")
        element = document.createTextNode(node);
      else if (node.nodeName === "svg") {
        element = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        isSvg = true;
      } else
        element = document.createElement(node.nodeName);

      const { attributes, children } = node;
      if (attributes) {
        if (attributes.oncreate)
          lifecycle.push(() => attributes.oncreate(element));

        children.forEach(child => element.appendChild(
          createElement(resolveNode(child, globalState, wiredActions))
        ));

        for (let name in attributes)
          updateAttribute(element, name, attributes[name], isSvg);

      }

      return element;
    }

  }
