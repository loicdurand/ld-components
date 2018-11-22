import style, { h, app } from 'ld-components';

const // 
state = {},
actions = {},
Test = style.div`
    color: red;
    text-transform: uppercase;
    :before, &:after {
        content: "z";
        color: blue;
        font-size: 12px;
    }
    @media all and (max-width: 600px) {
        font-size: 32px;
        font-style: italic;
    }
`,

view = (state, actions)=>(
    <Test>hello
        <span>world</span>
    </Test>
);

app(state, actions, view, document.body);
