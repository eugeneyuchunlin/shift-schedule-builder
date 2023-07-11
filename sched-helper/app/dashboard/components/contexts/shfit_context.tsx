import { createContext } from 'react';

import { ShiftConfig } from '../../shift_config_def';
import { ShiftContent } from '../shift/shift';

export const ShiftContext = createContext({} as any);

export const ShiftProvider = (
    {children, shiftConfig, shiftContent}: 
    {children: any, shiftConfig: ShiftConfig, shiftContent: ShiftContent}
) => {
    return (
        <ShiftContext.Provider value={ {shiftContent, shiftConfig} }>
            {children}
        </ShiftContext.Provider>
    )
}

export default ShiftContext;