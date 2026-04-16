import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from '../api/apiAuth';

const Login = () => {

    const [LoginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...LoginData, [name]: value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        const data = await loginUser(LoginData);

        console.log(data);

        if(data && data.token){
            localStorage.setItem("token", data.token);
            window.location.href = '/dashboard';
        }

        if(!LoginData.email.includes("@gmail.com")){
            alert("Only gmail domains are valid");
            return;
        }

        setLoginData({
            email: "",
            password: "",
        });
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">

            {/* Background accents */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">

                {/* Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/50">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-zinc-100 font-semibold tracking-tight text-sm">FocusFlow</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-zinc-500 text-sm mt-1">Sign in to continue your streak</p>
                    </div>

                    {/* Form — your original logic, styled */}
                    <form onSubmit={submitHandler} className="space-y-4">

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                            <input
                                type="text"
                                name="email"
                                onChange={changeHandler}
                                value={LoginData.email}
                                placeholder="you@example.com"
                                className="w-full bg-zinc-800/60 border border-zinc-700/60 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors duration-150">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                onChange={changeHandler}
                                value={LoginData.password}
                                placeholder="••••••••"
                                className="w-full bg-zinc-800/60 border border-zinc-700/60 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-all duration-200"
                            />
                        </div>

                        <input
                            type="submit"
                            value="Sign In"
                            className="w-full mt-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold rounded-xl px-4 py-3 text-sm cursor-pointer transition-all duration-200 shadow-lg shadow-violet-900/30"
                        />
                    </form>

                    {/* Footer */}
                    <p className="text-center text-zinc-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to='/register' className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-150">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login