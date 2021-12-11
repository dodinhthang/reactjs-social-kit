import _ from 'lodash'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
// eslint-disable-next-line no-unused-vars
import { TypeRef } from '../../index'
import { FacebookIcon } from '../FacebookLogin/FacebookIcon'

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  redirectUri?: string
  scope?: string
  returnScopes?: boolean
  xfbml?: boolean
  cookie?: boolean
  authType?: string
  fields?: string
  version?: string
  language?: string
  onFailure?: Function
  state?: string
  responseType?: string
  appId?: string
  onLoginSuccess: (data: FacebookSuccessData) => void
  onLogoutSuccess?: Function
}

interface FacebookSuccessData {
  accessToken: string
  dataAccessExpirationTime: number
  expiresIn: number
  firstName: string
  graphDomain: string
  id: string
  lastName: string
  name: string
  nameFormat: string
  picture: object
  shortName: string
  signedRequest: string
  userID: string
}

const _window = window as any

const FacebookLogin = forwardRef(
  (
    {
      className,
      style,
      children,
      redirectUri = typeof window !== 'undefined' ? window.location.href : '/',
      scope = 'public_profile,email',
      returnScopes = false,
      xfbml = false,
      cookie = false,
      authType = '',
      fields = 'id,first_name,last_name,middle_name,name,name_format,picture,short_name',
      version = '3.1',
      language = 'en_US',
      onFailure,
      state = 'facebookdirect',
      responseType = 'code',
      appId,
      onLoginSuccess,
      onLogoutSuccess
    }: Props,
    ref: React.Ref<TypeRef>
  ) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
      if (document.getElementById('facebook-jssdk')) {
        setIsLoaded(true)
      } else {
        init()
        load()
        let fbRoot = document.getElementById('fb-root')
        if (!fbRoot) {
          fbRoot = document.createElement('div')
          fbRoot.id = 'fb-root'
          document.body.appendChild(fbRoot)
        }
      }
    }, [])

    const init = () => {
      _window.fbAsyncInit = () => {
        _window.FB.init({
          version: `v${version}`,
          appId,
          xfbml,
          cookie
        })
        setIsLoaded(true)
      }
    }

    const load = () => {
      ;((d, s, id) => {
        const element = d.getElementsByTagName(s)[0]
        const fjs = element as any
        let js = element as any
        if (d.getElementById(id)) {
          return
        }
        js = d.createElement(s)
        js.id = id
        js.src = `https://connect.facebook.net/${language}/sdk.js`
        fjs.parentNode.insertBefore(js, fjs)
      })(document, 'script', 'facebook-jssdk')
    }

    const handleClickLogin = () => {
      if (!isLoaded) {
        return
      }

      const params = {
        client_id: appId,
        redirect_uri: redirectUri,
        state,
        return_scopes: returnScopes,
        scope,
        response_type: responseType,
        auth_type: authType
      }

      if (!_window.FB) {
        if (onFailure) {
          onFailure({ status: 'facebookNotLoaded' })
        }

        return
      }

      _window.FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          checkLoginStatus(response)
        } else {
          _window.FB.login(checkLoginStatus, {
            scope,
            return_scopes: returnScopes,
            auth_type: params.auth_type
          })
        }
      })
    }

    const checkLoginStatus = (response: any) => {
      if (response.authResponse) {
        getProfile(response.authResponse)
      } else {
        if (onFailure) {
          onFailure({ status: response.status })
        }
      }
    }

    const getProfile = (authResponse: any) => {
      _window.FB.api('/me', { locale: language, fields: fields }, (me: any) => {
        Object.assign(me, authResponse)
        var newObj = _.mapKeys(me, (_value, key) => _.camelCase(key))
        onLoginSuccess(newObj as any)
        setIsLogged(true)
      })
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

export { FacebookIcon, FacebookLogin }
