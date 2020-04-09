import React, { FC, createContext, useReducer, useContext, Dispatch } from 'react';

interface MessageContext {
    messages: Action['type'][];
    dispatch: Dispatch<Action>;
}
const MessageContext = createContext<MessageContext>({
    dispatch: () => {},
    messages: [],
});

type State = { messages: Action['type'][] };
type Action = { type: 'CREATE_BOOKING' } | { type: 'DELETE_LISTING' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        default:
            return {
                messages: [...state.messages, action.type],
            };
    }
};

export const MessageContextProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { messages: [] });
    const { messages } = state;

    return <MessageContext.Provider value={{ messages, dispatch }}>{children}</MessageContext.Provider>;
};

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessageContext must be used within a MessageContextProvider');
    }
    return context;
};
