import React, {useContext, useEffect, useRef} from 'react';
import {CurtainsContext} from "./store/curtainsStore";


const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toUpperCase();
    });
};

// execute this hook once our curtains webgl context is ready
// call again each time one of the dependencies change
export function useCurtains(callback, dependencies = []) {
    const {state} = useContext(CurtainsContext);

    const useCustomEffect = (effectCallback) => useEffect(effectCallback, [state.curtains].concat(dependencies));

    useCustomEffect(() => {
        let cleanUp;
        if(state.curtains && !state.curtains.errors && callback) {
            cleanUp = callback(state.curtains);
        }

        return () => {
            // execute cleanUp if it exists
            if(cleanUp && typeof cleanUp === "function") {
                cleanUp();
            }
        }
    });
}

// execute this hook when the corresponding curtains event is fired
// call again each time one of the dependencies change
export function useCurtainsEvent(event, callback, dependencies = []) {
    const availableEvents = [
        "onAfterResize",
        "onContextLost",
        "onContextRestored",
        "onError",
        "onRender",
        "onScroll",
    ];

    // do not crash if event passed is not allowed
    const validEvent = availableEvents.find((availableEvent) => event === availableEvent);

    const {dispatch} = useContext(CurtainsContext);
    const eventCallback = useRef({
        // curtains class events, see https://www.curtainsjs.com/curtains-class.html#events
        event,
        callback,
        id: generateUUID()
    });

    useCurtains(() => {
        // allow dependencies to be available inside the callback
        eventCallback.current.callback = callback.bind(dependencies);

        if(validEvent) {
            dispatch({
                type: "ADD_SUBSCRIPTION",
                addSubscription: eventCallback.current,
            });
        }

        const currentRenderCallback = eventCallback.current;
        return () => {
            if(validEvent) {
                dispatch({
                    type: "REMOVE_SUBSCRIPTION",
                    removeSubscription: currentRenderCallback,
                });
            }
        }
    }, [dispatch, validEvent].concat(dependencies));
}

export function useCurtainsAfterResize(callback, dependencies = []) {
    useCurtainsEvent("onAfterResize", callback, dependencies);
}

export function useCurtainsContextLost(callback, dependencies = []) {
    useCurtainsEvent("onContextLost", callback, dependencies);
}

export function useCurtainsContextRestored(callback, dependencies = []) {
    useCurtainsEvent("onContextRestored", callback, dependencies);
}

export function useCurtainsError(callback, dependencies = []) {
    useCurtainsEvent("onError", callback, dependencies);
}

export function useCurtainsRender(callback, dependencies = []) {
    useCurtainsEvent("onRender", callback, dependencies);
}

export function useCurtainsScroll(callback, dependencies = []) {
    useCurtainsEvent("onScroll", callback, dependencies);
}