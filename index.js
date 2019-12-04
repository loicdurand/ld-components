import { h, app } from 'hyperapp';

let // 
    tmp = false,
    _id = Math.floor(Math.random() * 1e6);

const //
    cache = {},
    sheet = document.head.appendChild(document.createElement("style")).sheet,
    resetTmp = () => [h(tmp.nodeName, tmp.attributes, tmp.children), tmp = false][0],
    insert = rule => 1 + sheet.insertRule(rule, sheet.cssRules.length) && '',           // allways return ''
    isProp = str => /.*:.*;/.test(str),
    isSelector = str => /^(&|:|>|\.|\*|\[)/.test(str),
    isClosingBracket = str => /\s?}\s?/.test(str),
    isMediaQuery = str => /^@/.test(str),
    createRule = (decls, isScss = false) => {
        let //
            parentSelector = isScss ? '._this' : '&',
            id = ".P" + _id++,
            i = 0,
            rule = '',
            endline = /;|}|{/g,
            lines = decls.replace(endline, m => m + '|').split('|');
        lines.map(line => {
            line = line.trim();
            if (isProp(line)) {                                                         // eg: color: red;
                rule += (i++ == 0 ? id + '{' + line : line);                            // rule = '.P1{ color: red;'
            } else if (!isClosingBracket(line)) {
                if (i++ != 0)
                    rule = insert(rule + '}');                                          // insert(rule = '.P1{ color: red;}')
                //                                                                         =================================
                if (isSelector(line))                                                   // eg: :before, &:after, & .bold {
                    rule += id + line.replace(new RegExp(parentSelector, 'g'), id)      // rule = '.P1:before, .P1:after, .P1 .bold {'
                //                                                                         ====================================
                else if (isMediaQuery(line) && !!!(i = 0))                              // eg: @media (...) {
                    rule += line;                                                       // no change but new loop ( i == 0 )
            } else {                                                                    // then
                i = !!(rule = insert(rule + ('@' == rule.charAt(0) ? '}}' : '}')));     // insert(@media(...){ .P1{ color: red;} })
            }
        });

        return id.slice(1);                                                             // return id = P1
    },

    style = nodeName => decls => (attributes = {}, children = attributes.children) => {
        if (tmp) return resetTmp();
        let isScss = typeof decls == 'string';
        let key = typeof decls == "function" ? decls(attributes) : decls.toString();
        cache[key] || (cache[key] = createRule(key, isScss));
        attributes.class = [attributes.class, cache[key]]
            .filter(Boolean)
            .join(" ")
        if (typeof nodeName != 'function')
            return h(nodeName, attributes, children);
        tmp = nodeName(attributes, children);
        tmp.attributes.class = attributes.class;
        return (typeof decls == 'function' && !nodeName.length) ? style(tmp.nodeName) : resetTmp();
    };

export default new Proxy(style, {                   // Proxy allows you to write 
    //                                                          style.div`...`
    get: (target, key) => target(key)               // instead of 
    //                                                          style('div')(`...`)                `
});

export { h, app };

