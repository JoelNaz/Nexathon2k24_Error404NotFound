import { useState } from 'react'
import toast from 'react-hot-toast';
import {useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/store';

export default function SignInOne() {
  const [username,setUsername] = useState("");
  const [password,setPassword] =useState("")
  const CentralLogin = useProfileStore((state)=>state.CentralLogin)
  const navigate=useNavigate()

  const handleSubmit = async () => {
    try {
      // Make a POST request to your backend sign-in endpoint
      const response = await CentralLogin({username, password})

      // Check if the sign-in was successful
      if (response.status === 200 && response.data.token) {
        // Save the token in local storage
        toast.success("Signed in successfully!");
        navigate('/dash/maps')
        // Redirect or navigate to the user's dashboard or another page
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("An error occurred during sign-in. Please try again.");
    }
  };





  return (
    <section >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign in As Central Admin</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a
                href="#"
                title=""
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Create a free account
              </a>
            </p>
            <form action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                    {' '}
                    Username{' '}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                      value={username}
                      onChange={(e)=>{setUsername(e.target.value)}}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      {' '}
                      Password{' '}
                    </label>
                    <a
                      href="#"
                      title=""
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      {' '}
                      Forgot password?{' '}
                    </a>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e)=>{setPassword(e.target.value)}}
                    ></input>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    onClick={handleSubmit}
                  >
                    Get started 
                    {/* <ArrowRight className="ml-2" size={16} /> */}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="h-screen ">
          <img
            className="mx-auto h-full w-full rounded-md object-cover"
            src="https://images.unsplash.com/photo-1683199844710-be9342d9432b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2lsZGxpZmUlMjBzYW5jdHVhcnl8ZW58MHx8MHx8fDA%3D"
            alt=""
          />
        </div>
      </div>
    </section>
  )
}