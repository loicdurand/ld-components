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
    isSelector = str => /^(&|:|>|\.|\*|\[|this)/.test(str),
    isClosingBracket = str => /\s?}\s?/.test(str),
    isMediaQuery = str => /^@/.test(str),
    createRule = (decls, isScss = false) => {
        let //
            parentSelector = isScss ? '\.?this' : '&',
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
                    rule += id + line.replace(new RegExp(parentSelector, 'g'), isScss ? '' : id);     // rule = '.P1:before, .P1:after, .P1 .bold {'
                //                                                                         ====================================
                else if (isMediaQuery(line) && !!!(i = 0))                              // eg: @media (...) {
                    rule += line;                                                       // no change but new loop ( i == 0 )
            } else {                                                                    // then
                i = !!(rule = insert(rule + ('@' == rule.charAt(0) ? '}}' : '}')));     // insert(@media(...){ .P1{ color: red;} })
            }
        });

        return id.slice(1);                                                             // return id = P1
    },

    styleElt = nodeName => decls => (attributes = {}, children = attributes.children) => {
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

export default new Proxy(styleElt, {                   // Proxy allows you to write 
    //                                                          style.div`...`
    get: (target, key) => target(key),               // instead of 
    //                                                          style('div')(`...`)  
});

export { h, app };

export const assoc = collection => decls => {

    const //
        refs = (typeof decls == 'object') ? decls : {},
        Collection = typeof collection == 'object' ? ($this) => collection : collection,
        output = {},
        mergeClasses = cpnt => (attributes = {}, children = attributes.children) => {
            const // 
                nodeName = Collection(output)[cpnt],
                elt = typeof nodeName == 'string' ? h(nodeName, attributes, children) : nodeName(attributes, children);
            for (let prop in attributes)
                elt.attributes[prop] = attributes[prop];
            elt.attributes.class = [elt.attributes.class, refs[cpnt]]
                .filter(Boolean)
                .join(" ");
            return h(elt.nodeName, elt.attributes, elt.children);
        };

    // if you don't pre-build your components using my own "ld-bundler" library, skip directly to the ELSE statement
    if (typeof decls == 'object') {
        for (let cpnt in Collection(output))
            output[cpnt] = mergeClasses(cpnt);

        return output;

    } else {
        let // 
            cpntRE = cpnt => new RegExp('[^\da-zA-Z#\.]' + cpnt + '{1}[^\da-zA-Z]', 'gm'),
            style = document.createElement("style"),
            id = 'P' + _id++,
            css = decls.toString();
        for (let cpnt in Collection(output)) {
            id = 'P' + _id++;
            css = css.replace(cpntRE(cpnt), m => m.replace(new RegExp(cpnt), '.' + id));
            refs[cpnt] = id;
            output[cpnt] = mergeClasses(cpnt);
        }

        style.type = "text/css";
        style.rel = "stylesheet";
        style.innerText = css;
        document.head.appendChild(style);
        return output;

    }
}

