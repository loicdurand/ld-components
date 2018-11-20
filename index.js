import { h, app } from 'hyperapp';
import picostyle from "picostyle";

const // 
    css = picostyle(h),

    smartify = {
        get: (target, key) => css(key)
    }

export const style = new Proxy(css, smartify);
export { h };
export { app };
