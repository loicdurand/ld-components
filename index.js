import { h, app } from 'hyperapp';

let _id = 0;

const //
    cache = {},
    sheet = document.head.appendChild(document.createElement("style")).sheet,
    insert = rule => sheet.insertRule(rule, sheet.cssRules.length),
    isProp = str => /.*:.*;/.test(str),
    isSelector = str => /^(:|>|\.|\*)/.test(str),
    isClosingBracket = str => /\s?}\s?/.test(str),
    isMediaQuery = str => /^@/.test(str),
    createStyle = decls => {
        let // 
            id = ".P" + _id++,
            i = 0,
            rule = '',
            endline = /;|}|{/g,
            lines = decls.replace(/\s+/g, ' ').replace(endline, m => m + '|').split('|');
        lines.map(line => {
            line = line.trim();
            if (isProp(line)) {
                rule += (i++ == 0 ? id + '{' + line : line);
            } else if (!isClosingBracket(line)) {
                insert(rule + '}');
                rule = '';
                rule += isSelector(line) ? (id + line.replace(/&/g, id)) :
                    (i = +isMediaQuery(line) ? 0 : i) ? (rule += line) : '';
            }
        });
        return id.slice(1);
    },
    picostyle = nodeName => decls => (attributes = {}, children = attributes.children) => {
        let key = typeof decls == "function" ? decls(attributes) : Array.isArray(decls) ? decls[0] : decls;
        cache[key] || (cache[key] = createStyle(key));
        attributes.class = [attributes.class, cache[key]]
            .filter(Boolean)
            .join(" ");
        return h(nodeName, attributes, children);
    };

export default new Proxy(picostyle, {
    get: (target, key) => target(key)
});

export { h, app };
