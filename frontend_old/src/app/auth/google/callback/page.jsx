'use client'
import { successMsg } from '@/util/toastNotifications';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


const App = () => {
    const { login, user } = useAuth()
    const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        login(token)
        successMsg("Login successful")
        router.push('/')
    }
  }, []);
  return (
    <div>
    </div>
  );
};

export default App;
