"use client"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/util/apiClient";
import "react-toastify/dist/ReactToastify.css"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_URL = "http://localhost:3000";
const LOGIN_URL = `${BACKEND_URL}/login`;
const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [])
	// const { login } = useAuth();
  const successMsg = (msg) => {
    toast.success(msg, {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    })
  }
  const errorMsg = (msg) => {
    toast.error(msg, {
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
    })
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
			const data = apiClient.post('/login', { email, password });

			data.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
				return Promise.reject(response);
			})
				.then((result) => {
					console.log(result.token);
					login(result.token);
					successMsg("Login Successful")

					setTimeout(() => {
            setIsLoading(false);
						router.push("/");
            
					}, 2000);
				})
				.catch((err) => {
					errorMsg(err.statusText);
				});
		} catch (error) {
			errorMsg(error.message);
		} finally {
			
		}
  }
  return (
    <div className="w-screen h-screen">
      <ToastContainer />
      <form className="grid w-full justify-center p-10 space-y-2" >
        <input
          className="h-8 rounded-lg px-2 border-teal-800 border-2"
          placeholder={"Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="h-8 rounded-lg px-2 border-teal-900 border-2"
          placeholder={"Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button disabled={isLoading}
          className="border-2 text-white font-medium bg-green-400 border-green-400 rounded-lg h-8 w-full place-self-center hover:border-green-500"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
      <div>{email} email</div>
      <p>{password} pass</p>
    </div>
  )
}

export default Auth
