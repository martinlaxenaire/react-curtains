import React, {useContext, useRef, useLayoutEffect} from 'react';
import {CurtainsProvider, CurtainsContext} from "../store/curtainsStore";
import {Curtains as WebGLCurtains} from 'curtainsjs';

function CurtainsWrapper(props) {
    const {state, dispatch} = useContext(CurtainsContext);

    const container = useRef(null);
    const curtains = useRef(null);

    const {
        // curtains class parameters
        alpha,
        antialias,
        premultipliedAlpha,
        depth,
        preserveDrawingBuffer,
        failIfMajorPerformanceCaveat,
        stencil,
        autoRender,
        autoResize,
        pixelRatio,
        renderingScale,
        watchScroll,

        // production
        production,

        // curtains class events
        onAfterResize,
        onContextLost,
        onContextRestored,
        onError,
        onRender,
        onScroll,

        ...validProps
    } = props;

    // mount
    const useMountEffect = (callback) => useLayoutEffect(callback, []);

    useMountEffect(() => {
        // only init curtains on client side!
        const canUseDOM = !!(
            typeof window !== 'undefined' &&
            window.document &&
            window.document.createElement
        );

        if(canUseDOM && !state.curtains && !curtains.current) {
            curtains.current = new WebGLCurtains({
                container: container.current,
                production: production ? production : process.env.NODE_ENV === "production",

                alpha,
                antialias,
                premultipliedAlpha,
                depth,
                preserveDrawingBuffer,
                failIfMajorPerformanceCaveat,
                stencil,
                autoRender,
                autoResize,
                pixelRatio,
                renderingScale,
                watchScroll,
            });

            dispatch({
                type: "SET_CURTAINS",
                curtains: curtains.current,
            });
        }

        const currentCurtains = curtains.current;
        return () => {
            if(currentCurtains) {
                currentCurtains.dispose();
            }
        }
    });

    const useStateEffect = (callback) => useLayoutEffect(callback, [state]);

    useStateEffect(() => {
        if(curtains.current) {
            curtains.current
                .onAfterResize(() => {
                    onAfterResize && onAfterResize(curtains.current);

                    // execute subscriptions hooks
                    state.subscriptions.onAfterResize.forEach(element => {
                        element.callback && element.callback(curtains.current)
                    });
                })
                .onContextLost(() => {
                    onContextLost && onContextLost(curtains.current);

                    // execute subscriptions hooks
                    state.subscriptions.onContextLost.forEach(element => {
                        element.callback && element.callback(curtains.current)
                    });
                })
                .onContextRestored(() => {
                    onContextRestored && onContextRestored(curtains.current);

                    // execute subscriptions hooks
                    state.subscriptions.onContextRestored.forEach(element => {
                        element.callback && element.callback(curtains.current)
                    });
                })
                .onError(() => {
                    onError && onError(curtains.current);

                    // execute subscriptions hooks
                    state.subscriptions.onError.forEach(element => {
                        element.callback && element.callback(curtains.current)
                    });
                })
                .onRender(() => {
                    onRender && onRender(curtains.current);

                    // execute subscriptions hooks
                    state.subscriptions.onRender.forEach(element => {
                        element.callback && element.callback(curtains.current)
                    });
                })
                .onScroll(() => {
                    onScroll && onScroll(curtains.current);

                    // execute subscriptions hooks
                    state.subscriptions.onScroll.forEach(element => {
                        element.callback && element.callback(curtains.current)
                    });
                });
        }
    });

    validProps.className = validProps.className || "curtains-canvas";

    // avoid passing children to validProps
    validProps.children = null;

    return (
        <div>
            {props.children}
            <div {...validProps} ref={container} />
        </div>
    );
}

export function Curtains(props) {
    return (
        <CurtainsProvider>
            <CurtainsWrapper {...props} />
        </CurtainsProvider>
    );
}