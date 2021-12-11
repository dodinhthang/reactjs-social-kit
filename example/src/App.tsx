import React, { useRef } from 'react'

import {
  ButtonLogin,
  FacebookIcon,
  FacebookLogin,
  GoogleIcon,
  GoogleLogin,
  GoogleSuccessData,
  TypeRef
} from 'reactjs-social-kit'
import 'reactjs-social-kit/dist/index.css'

const App = () => {
  const facebookRef = useRef<TypeRef>(null!)
  const googleRef = useRef<TypeRef>(null!)

  return (
    <div style={{ width: 400, margin: '0 auto' }}>
      <FacebookLogin
        appId='218302443821708'
        ref={facebookRef}
        onLoginSuccess={(res: any) => console.log(res)}
        onFailure={() => console.log('false')}
      >
        <ButtonLogin
          style={{ backgroundColor: '#1877F3' }}
          text='Login with Facebook'
          icon={<FacebookIcon style={{ margin: 5 }} />}
        />
      </FacebookLogin>
      <GoogleLogin
        clientId='742611787018-iekum2c2fdiv15lvv3geqia32qeepvts.apps.googleusercontent.com'
        ref={googleRef}
        onLoginSuccess={(res:GoogleSuccessData ) => console.log(res)}
        onFailure={() => console.log('false')}
      >
        <ButtonLogin
          style={{ backgroundColor: '#fff', color: '#888' }}
          text='Login with Google'
          icon={<GoogleIcon style={{ margin: 5 }} />}
        />
      </GoogleLogin>
    </div>
  )
}

export default App
