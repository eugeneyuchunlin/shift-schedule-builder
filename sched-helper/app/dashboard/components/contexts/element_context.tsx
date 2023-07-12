import { createContext } from 'react';

export const ElementContext = createContext({} as any);

export const ElementProvider = (
    {
        children,
        reset,
        updateShiftContentElement,
        addReservedLeave,
        removeReservedLeave
    }:
    {
        children: any,
        reset: boolean,
        updateShiftContentElement: (name: string, col: number, val: string) => void
        addReservedLeave: (row: number, col: number) => void
        removeReservedLeave: (row: number, col: number) => void
    }
) => {
    return (
        <ElementContext.Provider value={{
            reset,
            updateShiftContentElement,
            addReservedLeave,
            removeReservedLeave
        }}>
            {children}
        </ElementContext.Provider>
    )
}