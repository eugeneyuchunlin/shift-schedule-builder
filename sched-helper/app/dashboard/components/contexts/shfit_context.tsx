import { createContext } from 'react';

import { ShiftConfig } from '../../shift_config_def';
import { ShiftContent } from '../shift/shift';

export const ShiftContext = createContext({} as any);

export const ShiftProvider = (
    {children, shiftConfig, shiftContent, updateContentFlag}: 
    {children: any, shiftConfig: ShiftConfig, shiftContent: ShiftContent, updateContentFlag: boolean}
) => {
    return (
        <ShiftContext.Provider value={ {shiftContent, shiftConfig, updateContentFlag} }>
            {children}
        </ShiftContext.Provider>
    )
}

export default ShiftContext;