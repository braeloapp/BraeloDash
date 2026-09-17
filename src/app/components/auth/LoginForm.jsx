"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginApi } from "@/app/API/method";
import { persistAdminSession } from "@/lib/adminAuth";
import { validateLoginForm } from "@/lib/loginValidation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/app/components/ux/LanguageSwitcher";
import AppLoader from "@/app/components/ux/AppLoader";
import { FiEye, FiEyeOff } from "react-icons/fi";

function HeroPanel({ t }) {
  return (
    <div className="login-hero relative hidden min-h-dvh overflow-hidden md:block">
      <Image
        src="/images/1.png"
        alt=""
        fill
        priority
        className="object-cover object-[center_20%]"
        sizes="50vw"
      />
      <div className="login-hero__veil" aria-hidden />
      <div className="relative z-[1] flex h-full min-h-dvh flex-col justify-between p-10 lg:p-12">
        <p className="max-w-[16ch] text-[26px] font-light leading-[1.2] tracking-tight text-white lg:text-[30px]">
          {t("login.heroTitleLead")}{" "}
          <span className="font-semibold">{t("login.heroTitleEmph")}</span>{" "}
          {t("login.heroTitleTail")}
        </p>
        <div className="flex items-end justify-between gap-4">
          <Image
            src="/images/white logo.png"
            alt="Braelo"
            width={168}
            height={48}
            className="h-auto w-[150px] object-contain drop-shadow-sm"
            priority
          />
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
  const { t } = useLanguage();

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
      toast.success(t("login.success"));
      router.push("/pages/dashboard");
    } catch (error) {
      toast.error(error.message || t("login.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid min-h-dvh grid-cols-1 bg-white md:grid-cols-2">
        <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 md:px-14 lg:px-16">
          <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
            <LanguageSwitcher variant="light" align="right" />
          </div>

          <div className="w-full max-w-[400px]">
            <div className="mb-10 md:hidden">
              <Image
                src="/black logo.png"
                alt="Braelo"
                width={140}
                height={36}
                className="h-auto w-[132px] object-contain"
                priority
              />
            </div>

            <div className="mb-9">
              <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#232F30] sm:text-[40px]">
                {t("appName")}
              </h1>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-[#8B949E]">
                {t("appTagline")}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="login-email" className="field-label">
                  {t("login.email")}
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  autoComplete="username"
                  className="field-control"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="field-label">
                  {t("login.password")}
                </label>
                <div className="relative w-full">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.passwordPlaceholder")}
                    autoComplete="current-password"
                    className="field-control pr-12"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword((v) => !v);
                    }}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] focus:outline-none"
                    aria-label={
                      showPassword
                        ? t("login.hidePassword")
                        : t("login.showPassword")
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <FiEyeOff className="pointer-events-none h-5 w-5" />
                    ) : (
                      <FiEye className="pointer-events-none h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary mt-3 w-full !rounded-2xl !py-3.5 text-[15px] font-semibold"
              >
                {isLoading ? (
                  <>
                    <AppLoader
                      size="sm"
                      full={false}
                      showLabel={false}
                      tone="light"
                    />
                    <span>{t("login.submitting")}</span>
                  </>
                ) : (
                  t("login.submit")
                )}
              </button>
            </form>
          </div>
        </div>

        <HeroPanel t={t} />
      </div>
    </>
  );
}
