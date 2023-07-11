import { createContext } from 'react';

export const ShiftContext = createContext({} as any);

export const ShiftProvider = ({children, shift_content}: {children: any, shift_content: any}) => {
    return (
        <ShiftContext.Provider value={ {shift_content} }>
            {children}
        </ShiftContext.Provider>
    )
}

export default ShiftContext;