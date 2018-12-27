import style, { h, app } from './ld-components';

// export const Col = (props, children)=>{
//     console.log(props)
// }


// const Reperes = style.div(props => `
//     box-sizing: border-box;
// 	-webkit-box-sizing: border-box;
// 	-moz-box-sizing: border-box;
//     ${ props.visible ? `
//         & * {
// 	        border: 1px solid black;
// 	        background: rgba(0,0,0,.2);
// 	        padding-top: 5px;
//             padding-bottom: 5px;
//     }` : ''}
// `);

// const Row = style.div`
//     background: rgba(0,0,0,.2);
//     margin-left: -15px;
//     margin-right: -15px;
//     :before, &:after, & .bold {
//         display: table;
//         content: "";
//         clear: both;
//     }`;



// const Col = style.div(
//     props => {
//         props.s = props.s || 12;
//         props.m = props.m || props.s;
//         props.l = props.l || props.m;
//         props.offsetS = props.offsetS || 0;
//         props.offsetM = props.offsetM || props.offsetS;
//         props.offsetL = props.offsetL || props.offsetM;
//         // return {
//         //     paddingLeft: '15px',
//         //     paddingRight: '15px',
//         //     float: 'left',
//         //     position: 'relative',
//         //     "@media all and (min-width: 0px) and (max-width: 639px)": {
//         //         width: `${100 / 12 * props.s}%`,
//         //         marginLeft: `${100 / 12 * props.offsetS}%`
//         //     },
//         //     "@media all and (min-width: 640px) and (max-width: 991px)": {
//         //         width: `${100 / 12 * props.m}%`,
//         //         marginLeft: `${100 / 12 * props.offsetM}%`
//         //     },
//         //     "@media all and (min-width: 992px)": {
//         //         width: `${100 / 12 * props.l}%`,
//         //         marginLeft: `${100 / 12 * props.offsetL}%`
//         //     }
//         // }
//         return `
//             display: block;
//             background: rgba(0,0,0,.4);
//             padding-left: 15px;
//             padding-right: 15px;
//             float: left;
//             position: relative;
//             .bold{
//                 color: #fff;
//             }
//             @media all and (min-width: 0px) and (max-width: 639px) {
//                 width: ${100 / 12 * props.s}%;
//                 margin-left: ${100 / 12 * props.offsetS}%;
//             }
//             @media all and (min-width: 640px) and (max-width: 991px) {
//                 width: ${100 / 12 * props.m}%;
//                 margin-left: ${100 / 12 * props.offsetM}%;
//             }
//             @media all and (min-width: 992px) {
//                 width: ${100 / 12 * props.m}%;
//                 margin-left: ${100 / 12 * props.offsetL}%;
//             }
//         `
//     }
// )

// const Span = style('span')(`
//     & .bold {
//         font-weight: bold;
//     }
//     color: blue;
//     background: red;
//     text-transform: uppercase;

// `);

const Prox = style.div`color: blue;`;

const Prox2 = style.div(props => `color: ${props.color};`);

const Func = style((props, children) => <div color={props.color}>{children}</div>)(props => `color: ${props.color || 'red'};`);

const Func2 = style((props, children) => <div>{children}</div>)`color: red;`;

const Inherit = style(Func2)`text-decoration: underline;`;


const // 
    state = {},
    actions = {},
    //     Test = style.div`
    //     color: red;
    //     text-transform: uppercase;
    //     :before, &:after {
    //         content: "z";
    //         color: blue;
    //         font-size: 4em;
    //     }
    //     @media all and (max-width: 600px) {
    //         text-decoration: underline;
    //         font-style: italic;
    //     }
    // `,

    view = (state, actions) => (
        <div>
            
            <Func2>I am red</Func2>
            <Prox>I am blue</Prox>
            <Prox2 color="teal">I am teal</Prox2>
            <Func color="green">I am green</Func>
            <Inherit>I am red too, but underlined</Inherit>

            {/* <Reperes>
                <Row>
                    <Col s="3" m="4" l="6">
                        <Span>hello</Span>
                    </Col>
                    <Col s="3" m="4" l="4">
                        <Span class="bold">world</Span>
                    </Col>
                    <Col s="3" m="4" l="3">
                        <Span>!!!</Span>
                        <Test />
                    </Col>

                </Row>
            </Reperes> */}

        </div>

    );

app(state, actions, view, document.body);
