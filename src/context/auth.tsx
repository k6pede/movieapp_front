import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'

import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from '@firebase/auth'
import { auth } from '@/config/FirebaseConfig'
import { FirebaseError } from '@firebase/util'
import { apiClient } from '@/utils/api'

/** firebase認証をしたユーザー。
 * @param id firebaseのuid
 * @param name プロバイダアカウントの登録名
 * @param email プロバイダアカウントのemailアドレス
 */
interface FirebaseUser {
  id: string
  name: string
  email: string
}

/** サービスで独自に管理するユーザー情報のinterface
 * @param id firebaseのuid
 * @param name プロバイダアカウントの登録名
 * @param email プロバイダアカウントのemailアドレス
 * @param deleted_at アカウント削除日
 * @param is_banned ブラックリストアカウントかどうかを判断する値
 */
type LoginUser = {
  id: string
  name: string
  email: string
  deleted_at: string | null
  is_banned: boolean
}

type LoginMethod = 'google' | 'microsoft'

interface AuthContextState {
  user: FirebaseUser | undefined
  isPending: boolean
  setUser: Dispatch<SetStateAction<FirebaseUser | undefined>>
  login: (loginMethod: LoginMethod) => Promise<boolean>
  logout: () => void
}

// createContextはcontestオブジェクトを作成する : ProviderとConsumerを持つ
export const AuthContext = createContext<AuthContextState>({
  user: undefined,
  isPending: false,
  setUser: () => {},
  login: (() => {}) as any,
  logout: (() => {}) as any,
})

// ログインに使用するProviderのインスタンスとクラスを返す
const getProvider = (method: LoginMethod) => {
  switch (method) {
    case 'google':
      return {
        providerInstance: new GoogleAuthProvider(),
        providerClass: GoogleAuthProvider,
      }
    case 'microsoft':
      return {
        providerInstance: new OAuthProvider('microsoft.com'),
        providerClass: OAuthProvider,
      }
    default:
      throw Error('Failed to auth: unknown provider type provided')
  }
}

export function AuthProvider({
  children,
}: Readonly<{
  // Readonly: childrenを読み取り専用(書き換えない) 書き換えようとするとコンパイルエラーになる
  children: ReactNode
}>) {
  const [user, setUser] = useState<FirebaseUser>()
  const [isPending, setIsPending] = useState(false)

  /**
   * googleかmicrosoftを渡すことでユーザーを返す
   * @param method 'google' | 'microsoft'
   */
  async function authenticateUser(method: LoginMethod) {
    const { providerInstance, providerClass } = getProvider(method)

    try {
      const { user: authenticatedUser } = await signInWithPopup(auth, providerInstance)
      return authenticatedUser
    } catch (error) {
      if (error instanceof FirebaseError) {
        const credential = providerClass.credentialFromError(error)
        if (!credential) throw error
        const { user: authenticateUser } = await signInWithCredential(auth, credential)
        return authenticateUser
      }
      throw error
    }
  }

  type SuccessResponse = { data: LoginUser }
  type FailResponse = { detail: string }

  /**
   * firebaseから返却されたidTokenをサーバーに送り、認証を行う
   * @param tokenId
   */
  async function sendAuthorizationRequest(idToken: string) {
    const headers = {
      Authorization: `Bearer ${idToken}`,
    }

    const { data, response } = await apiClient.get<SuccessResponse | FailResponse>(
      'http://localhost:8000/me',
      { headers }
    )

    if (response.ok) {
      return data as SuccessResponse
    }

    const { detail } = data as FailResponse
    switch (response.status) {
      case 401:
        throw new FirebaseError('auth/id-token-expired', detail)
      default:
        throw new Error(response.statusText)
    }
  }

  async function login(method: LoginMethod): Promise<boolean> {
    try {
      setIsPending(true)
      console.log('login start')

      const authenticatedUser = await authenticateUser(method)
      console.log('authenticatedUser', authenticateUser)
      const token = await authenticatedUser.getIdToken()

      const { data: firebaseUser } = await sendAuthorizationRequest(token)
      setUser(firebaseUser)
      return true
    } catch (error) {
      // TODO: エラーハンドリング
      return false
    } finally {
      setIsPending(false)
    }
  }

  async function logout() {
    try {
      console.log('logout start')
      setUser(undefined)
      return true
    } catch (err) {
      return false
    }
  }

  const contextValue = useMemo(
    () => ({
      user,
      isPending,
      setUser,
      login,
      logout,
    }),
    [user, isPending]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
