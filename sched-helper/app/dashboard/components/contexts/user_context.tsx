import { createContext } from 'react';

export const UserContext = createContext({} as any);

export const UserProvider = (
    {
        children, 
        user
    }: 
    {
        children: any, 
        user: any
    }
) => {
    return (
        <UserContext.Provider value={{
                user
        }}>
            {children}
        </UserContext.Provider>
    )
}