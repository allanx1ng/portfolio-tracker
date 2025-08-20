require("dotenv").config()
import { GoogleOAuthProvider } from "@react-oauth/google"

export default function ({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <>{children}</>
    </GoogleOAuthProvider>
  )
}
