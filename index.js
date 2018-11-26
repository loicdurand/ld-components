import { h, app } from 'hyperapp';

let _id = 0;

const //
    cache = {},
    sheet = document.head.appendChild(document.createElement("style")).sheet,
    insert = rule => 1 + sheet.insertRule(rule, sheet.cssRules.length) && '',           // allways return ''
    isProp = str => /.*:.*;/.test(str),
    isSelector = str => /^(&|:|>|\.|\*)/.test(str),
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
            if (isProp(line)) {                                                         // eg: color: red;
                rule += (i++ == 0 ? id + '{' + line : line);                            // rule = '.P1{ color: red;'
            } else if (!isClosingBracket(line)) {
                if (i++ != 0)
                    rule = insert(rule + '}');                                          // insert(rule = '.P1{ color: red;}')
                //                                                                         =================================
                if (isSelector(line))                                                   // eg: :before, &:after, & .bold {
                    rule += id + line.replace(/^&/g, '').replace(/&/g, id)              // rule = '.P1:before, .P1:after, .P1 .bold {'
                //                                                                         ====================================
                else if (isMediaQuery(line) && !!!(i = 0))                              // eg: @media (...) {
                    rule += line;                                                       // no change but new loop ( i == 0 )
            } else {                                                                    // then
                i = !!(rule = insert(rule + ('@' == rule.charAt(0) ? '}}' : '}')));     // insert(@media(...){ .P1{ color: red;} })
            }
        });

        return id.slice(1);                                                             // return id = P1
    },
    picostyle = nodeName => decls => (attributes = {}, children = attributes.children) => {
        let key = typeof decls == "function" ? decls(attributes) : decls.toString();
        cache[key] || (cache[key] = createStyle(key));
        attributes.class = [attributes.class, cache[key]]
            .filter(Boolean)
            .join(" ");
        return h(nodeName, attributes, children);
    };

export default new Proxy(picostyle, {                   // Proxy allows you to write 
    //                                                          picostyle.div`...`
    get: (target, key) => target(key)                   // instead of 
    //                                                          picostyle('div')(`...`)                `
});

export { h, app };
