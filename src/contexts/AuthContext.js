import {useState, useEffect, useContext, createContext} from 'react'
import {useAuth, useDb} from 'services/Api'

const AuthContext = createContext()

export function useAuthContext() {
    return useContext(AuthContext)
}

export function AuthContextProvider(props) {
    const [auth, setAuth] = useState()
    console.log('Context', auth)

    useEffect(() => {
        useAuth.onAuthStateChanged(user => {
            if (user?.emailVerified) {
                useDb.collection('users').doc(user.uid).get().then(res => {
                    setAuth(res.data())
                })
            } else {
                setAuth(null)
            }
        })
    }, [])

    return (
        <AuthContext.Provider value={{auth, dispatch: setAuth}}>
            {props.children}
        </AuthContext.Provider>
    )
}