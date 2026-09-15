"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginApi } from "@/app/API/method";
import { persistAdminSession } from "@/lib/adminAuth";
import { validateLoginForm } from "@/lib/loginValidation";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ImageSection() {
  return (
    <div className="relative hidden h-full min-h-[100dvh] overflow-hidden md:block">
      <div className="absolute inset-0 flex items-center justify-end">
        <Image
          src="/images/2.png"
          alt=""
          className="absolute right-[50px] top-0 h-full max-h-full object-cover"
          width={500}
          height={500}
        />
        <Image
          src="/images/3.png"
          alt=""
          className="absolute right-[25px] top-0 h-full max-h-full object-cover"
          width={500}
          height={500}
        />
        <div>
          <Image
            src="/images/1.png"
            alt=""
            className="absolute right-0 top-0 h-full max-h-full rounded-lg object-cover"
            width={500}
            height={500}
          />
          <h2 className="relative z-50 bottom-52 right-64 w-44 p-0 text-xl text-white">
            Somos a <span className="font-bold">conexão</span> entre negócios,{" "}
            <span className="font-semibold">pessoas e sonhos</span>
          </h2>
          <div>
            <Image
              src="/images/white logo.png"
              alt="Braelo"
              className="relative z-50 top-52 right-64"
              width={180}
              height={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLoginForm(email, password);
    if (!validation.ok) {
      toast.error(validation.message);
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await LoginApi("/admin-panel/login", {
        email,
        password,
      });

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      const token =
        response.data?.token?.access ||
        response.data?.access_token ||
        response.data?.data?.token?.access;

      if (!token) {
        throw new Error("Token not found in response");
      }

      const profile = response.data?.data || response.data;
      persistAdminSession({
        token,
        role: profile?.is_superuser
          ? "super_admin"
          : profile?.is_staff
            ? "admin"
            : "admin",
        name: profile?.name,
      });
      toast.success("Login successful!");
      router.push("/pages/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((v) => !v);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid min-h-dvh grid-cols-1 bg-white md:grid-cols-12">
        <div className="col-span-1 flex items-center justify-center px-5 py-10 md:col-span-6 md:px-10">
          <div className="w-full max-w-[360px] space-y-8">
            <div className="md:hidden">
              <div className="mb-8 inline-flex items-center rounded-2xl bg-[#FFCC35] px-4 py-3">
                <Image
                  src="/black logo.png"
                  alt="Braelo"
                  width={140}
                  height={36}
                  className="h-auto w-[132px] object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-[28px] font-semibold tracking-tight text-[#232F30]">
                Braelo Power Admin
              </h1>
              <p className="mt-2 text-sm text-[#78828A]">
                Sign in to manage users, listings, and businesses.
              </p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="username"
                aria-label="Email"
                className="w-full rounded-xl border border-[#EEF1F4] bg-[#F6F8FB] px-4 py-3 text-[#232F30] placeholder:text-[#ACB6BE] focus:outline-none"
                required
              />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#EEF1F4] bg-[#F6F8FB] px-4 py-3 pr-12 text-[#232F30] placeholder:text-[#ACB6BE] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  tabIndex={0}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePasswordVisibility();
                  }}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md p-1.5 text-[#78828A] hover:text-[#232F30] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 pointer-events-none" aria-hidden />
                  ) : (
                    <FiEye className="h-5 w-5 pointer-events-none" aria-hidden />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex w-full items-center justify-center rounded-xl bg-[#CD9403] px-6 py-3 text-[16px] font-medium text-white transition hover:bg-[#b37f02] ${
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:col-span-6 md:block">
          <ImageSection />
        </div>
      </div>
    </>
  );
}
