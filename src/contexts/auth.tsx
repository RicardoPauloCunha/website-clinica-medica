import { createContext, ReactNode, useContext, useState } from 'react';

import { TokenData } from '../localStorages/auth';

type AuthContextData = {
    userIsChecked: boolean;
    loggedUser: TokenData | undefined;
    defineLoggedUser: (value: TokenData | undefined) => void;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [loggedUser, setLoggedUser] = useState<TokenData | undefined>(undefined);
    const [userIsChecked, setUserIsChecked] = useState(false);

    const defineLoggedUser = (value: TokenData | undefined) => {
        setLoggedUser(value);
        setUserIsChecked(true);
    }

    let valueContext = {
        userIsChecked,
        loggedUser,
        defineLoggedUser
    }

    return (
        <AuthContext.Provider value={valueContext}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}