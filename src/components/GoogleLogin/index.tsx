import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
// eslint-disable-next-line no-unused-vars
import { TypeRef } from '../../index'
import { GoogleIcon } from './GoogleIcon'
import _ from 'lodash'

interface Props {
  className?: string
  style?: React.CSSProperties
  scope?: string
  prompt?: string
  uxMode?: string
  clientId: string
  loginHint?: string
  accessType?: string
  redirectUri?: string
  cookiePolicy?: string
  hostedDomain?: string
  discoveryDocs?: string
  children?: React.ReactNode
  onLogoutSuccess?: () => void
  onLogoutFailure?: () => void
  fetchBasicProfile?: boolean
  onLoginSuccess: (data: GoogleSuccessData) => void
  onFailure?: Function
}

export interface GoogleSuccessData {
  accessToken: string
  avatar: string
  email: string
  expiresAt: number
  expiresIn: number
  firstName: string
  firstIssuedAt: number
  id: string
  idToken: string
  idpId: string
  lastName: string
  loginHint: string
  name: string
  providerId: string
  scope: string
  sessionState: object
  tokenType: string
}

const GoogleLogin = forwardRef(
  (
    {
      className,
      style,
      children,
      clientId,
      scope = 'email profile',
      prompt = 'select_account',
      uxMode,
      loginHint = '',
      accessType = 'online',
      onLoginSuccess,
      onLogoutSuccess,
      redirectUri = '/',
      cookiePolicy = 'single_host_origin',
      hostedDomain = '',
      discoveryDocs = '',
      fetchBasicProfile = true,
      onFailure
    }: Props,
    ref: React.Ref<TypeRef>
  ) => {
    let _window: any
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
      _window = window
      if (document.getElementById('google-login')) {
        setIsLoaded(true)
      } else {
        init(() => {
          load()
        })
      }
    }, [])

    const init = (cb: () => void) => {
      const ggScriptTag: any = document.createElement('script')
      ggScriptTag.id = 'google-login'
      ggScriptTag.src = 'https://apis.google.com/js/api.js'
      ggScriptTag.async = true
      ggScriptTag.defer = true
      const scriptNode = document.getElementsByTagName('script')![0]
      scriptNode &&
        scriptNode.parentNode &&
        scriptNode.parentNode.insertBefore(ggScriptTag, scriptNode)
      ggScriptTag.onload = cb
    }

    const load = () => {
      const params = {
        client_id: clientId,
        cookie_policy: cookiePolicy,
        login_hint: loginHint,
        hosted_domain: hostedDomain,
        fetch_basic_profile: fetchBasicProfile,
        discoveryDocs: discoveryDocs,
        ux_mode: uxMode,
        redirect_uri: redirectUri,
        access_type: accessType,
        scope: '',
        immediate: true
      }
      _window.gapi.load('auth2', () => {
        const gapiAuth = _window.gapi.auth2
        !gapiAuth.getAuthInstance() &&
          gapiAuth.init(params).then(() => {
            setIsLoaded(true)
          })
      })
    }

    const handleClickLogin = () => {
      _window = window as any
      if (!isLoaded) {
        return
      }
      if (!_window.gapi) {
        load()
      } else {
        const auth2 = _window.gapi.auth2.getAuthInstance()
        const options = {
          prompt,
          scope,
          ux_mode: uxMode
        }
        auth2
          .signIn(options)
          .then(handleResponse)
          .catch(() => onFailure && onFailure())
      }
    }

    const handleResponse = (res: any) => {
      setIsLogged(true)
      const data: any = {}
      Object.values(res)
        // eslint-disable-next-line camelcase
        .filter((item: any) => typeof item === 'string' || item?.access_token)
        .forEach((item) => {
          typeof item === 'string'
            ? (data.provider_id = item)
            : Object.entries(item as any).map(
                ([key, value]: any) => (data[key] = value)
              )
        })
      const auth2 = _window.gapi.auth2.getAuthInstance()
      if (auth2.isSignedIn.get()) {
        const profile = auth2.currentUser.get().getBasicProfile()
        data.id = profile.getId()
        data.name = profile.getName()
        data.firstName = profile.getGivenName()
        data.lastName = profile.getFamilyName()
        data.avatar = profile.getImageUrl()
        data.email = profile.getEmail()
      }
      var newObj = _.mapKeys(data, (_value, key) => _.camelCase(key))

      onLoginSuccess(newObj as any)
    }

    const handleClickLogout = () => {
      if (isLogged) {
        setIsLogged(false)
        onLogoutSuccess && onLogoutSuccess()
        _window.FB.logout()
      }
    }

    if (ref) {
      useImperativeHandle(ref, () => ({
        onLogout: () => {
          if (isLogged) {
            setIsLogged(false)
            onLogoutSuccess && onLogoutSuccess()
            _window.FB.logout()
          } else {
            console.log('You must login before logout.')
          }
        }
      }))
    }

    return (
      <div
        className={className}
        style={style}
        onClick={isLogged ? handleClickLogout : handleClickLogin}
      >
        {children}
      </div>
    )
  }
)

export { GoogleLogin, GoogleIcon }
