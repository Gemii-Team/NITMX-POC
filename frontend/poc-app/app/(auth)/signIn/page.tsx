"use client"

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@store/useAuthStore';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

type FormData = LoginFormData 

const SignInComponent: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { signIn, loading } = useAuthStore();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        reset();
    }, [reset]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setError(null);
        try {
            await signIn(data.email, data.password);
            router.push('/dashboard'); 
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="flex h-screen">
            <div className="m-auto w-full max-w-4xl rounded-lg bg-white shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
                <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-8 md:p-12 content-center">
                        <h2 className="mb-6 text-3xl font-bold text-primary">Welcome to EYE</h2>
                        {error && <p className="mb-4 text-sm text-error">{error}</p>}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        id="email"
                                        placeholder="example@email.com"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register("password")}
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="••••••••"
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                    <div className="hidden md:block w-1/2 relative overflow-hidden">
                        <img
                            src="/images/image.png"
                            alt="Credit cards"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInComponent;