import { createContext } from 'react';

import { ShiftConfig } from '../../shift_config_def';
import { ShiftContent } from '../shift/shift';

export const ShiftContext = createContext({} as any);

export const ShiftProvider = (
    {
        children, 
        shiftConfig, 
        shiftContent, 
        updateContentFlag,
        reservedLeave,
        reservedWD,
        updateReservedFlag
    }: 
    {
        children: any, 
        shiftConfig: ShiftConfig, 
        shiftContent: ShiftContent, 
        updateContentFlag: boolean,
        reservedLeave: {},
        reservedWD: {}
        updateReservedFlag: boolean
    }
) => {
    return (
        <ShiftContext.Provider value={{
                shiftContent, 
                shiftConfig, 
                updateContentFlag, 
                reservedLeave,
                reservedWD,
                updateReservedFlag
        }}>
            {children}
        </ShiftContext.Provider>
    )
}

export default ShiftContext;