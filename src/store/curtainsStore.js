import React, {createContext, useReducer} from "react";

const initialState = {
    curtains: null,
    // subscriptions to hook on curtains class events
    subscriptions: {
        onAfterResize: [],
        onContextLost: [],
        onContextRestored: [],
        onError: [],
        onSuccess: [],
        onRender: [],
        onScroll: [],
    },
};

export const CurtainsContext = createContext(initialState);

export function CurtainsProvider({ children }) {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_CURTAINS":
                return {
                    ...state,
                    curtains: action.curtains
                };

            case "ADD_SUBSCRIPTION":
                // get store state and subscription action
                const {...addSubscriptionState} = state;
                const {addSubscription} = action;

                // is it already in our subscription event array?
                const existingSubscription = addSubscriptionState.subscriptions[addSubscription.event].find(el => el.id === addSubscription.id);
                // if not we'll add it
                if(!existingSubscription) {
                    addSubscriptionState.subscriptions[addSubscription.event].push(addSubscription);
                }

                // return updated store state
                return addSubscriptionState;

            case "REMOVE_SUBSCRIPTION":
                // get store state and subscription action
                const {...removeSubscriptionState} = state;
                const {removeSubscription} = action;

                // remove from our subscription event array
                removeSubscriptionState.subscriptions[removeSubscription.event] = removeSubscriptionState.subscriptions[removeSubscription.event].filter(el => el.id !== removeSubscription.id);

                // return updated store state
                return removeSubscriptionState;

            default:
                throw new Error();
        }
    }, initialState);

    return (
        <CurtainsContext.Provider value={{ state, dispatch }}>
            {children}
        </CurtainsContext.Provider>
    );
}
