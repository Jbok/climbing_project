import type { User } from '@firebase/auth'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { AuthContext } from '../context/authContext'
import { auth } from '../components/Firebase'

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((fbUser: User | null) => {
      console.log(`구독 실행`, fbUser)
      setUser(fbUser)
    })
    return subscribe
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
