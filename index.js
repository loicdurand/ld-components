import { h, app } from 'hyperapp';

let _id = 0;

const //
    cache = {},
    sheet = document.head.appendChild(document.createElement("style")).sheet,
    insert = rule => sheet.insertRule(rule, sheet.cssRules.length),
    isProp = str => /.*:.*;/.test(str),
    isSelector = str => /^(_|:|>|\.|\*)/.test(str),
    isClosingBracket = str => /\s?}\s?/.test(str),
    isMediaQuery = str => /^@/.test(str),
    createStyle = decls => {
        let // 
            id = ".P" + _id++,
            i = 0,
            rule = '',
            endline = /;|}|{/g,
            lines = decls.replace(endline, m => m + '|').split('|');
        lines.map(line => {
            line = line.trim();
            if (isProp(line)) {                                                 // eg: color: red;
                rule += (i++ == 0 ? id + '{' + line : line);                    // rule = '.P1{ color: red;'
            } else if (!isClosingBracket(line)) {
                insert(rule + '}');                                             // insert(rule = '.P1{ color: red;}')
                rule = '';                                                      // ===================================
                if (isSelector(line)) {                                         // eg: :before, &:after, & .bold {
                    rule += id + line                                           // rule = '.P1:before, &:after, & .bold {'
                        .replace(/&/g, id)                                      // rule = '.P1:before, .P1:after, .P1 .bold {'
                                                                                // ===================================
                        .replace(/_/g, id + ' ')                                // eg: _.bold { ==> rule = '.P1 .bold {'
                                                                                // ===================================
                } else if (isMediaQuery(line)) {                                // eg: @media (...) {
                    rule += line;                                               // no change
                    i = 0;                                                      // but new loop
                }
            }
        });

        return id.slice(1);                                                     // return id = P1
    },
    picostyle = nodeName => decls => (attributes = {}, children = attributes.children) => {
        let key = typeof decls == "function" ? decls(attributes) : decls.toString();
        cache[key] || (cache[key] = createStyle(key));
        attributes.class = [attributes.class, cache[key]]
            .filter(Boolean)
            .join(" ");
        return h(nodeName, attributes, children);
    };

export default new Proxy(picostyle, {                                           // Proxy allows you to write 
                                                                                //      picostyle.div`
    get: (target, key) => target(key)                                           //          color: red;
                                                                                //      `;                  `
                                                                                // instead of picostyle('div')(` color: red; `) 
});

export { h, app };
