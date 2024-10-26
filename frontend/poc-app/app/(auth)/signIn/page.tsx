"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type FormData = LoginFormData;

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, loading } = useAuthStore();

  const { handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit = async () => {
    setError(null);
    try {
      await signIn("a@a.com", "123456789");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Form Section */}
          <div className="flex-1 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center md:text-left mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                  Welcome to EYE
                </h2>
                {error && (
                  <p className="mt-2 text-sm text-error animate-fadeIn">
                    {error}
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <button
                  onClick={async () => await onSubmit()}
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-11"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Additional Links */}
              {/* <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Don\'t have an account?
                  <a href="#" className="text-primary hover:text-primary-focus font-medium">
                    Contact us
                  </a>
                </p>
              </div> */}
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block w-full md:w-1/2 relative min-h-[400px]">
            <div className="absolute inset-0">
              <Image
                src="/images/image.png"
                alt="Credit cards"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
                className="transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}