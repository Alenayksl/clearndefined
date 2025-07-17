"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { API_ENDPOINTS } from "@/app/constants/endpoints";
import { useAuthStore } from "@/app/stores/authStore";
import { setAccessToken, setRefreshToken } from "@/app/utils/cookies";
import { AxiosError } from "axios";

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      const { accessToken, refreshToken, user } = res.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white backdrop-blur-sm : shadow-lg max-w-md rounded-2xl">
        <h2 className="text-cyan-950 flex items-center justify-center text-2xl font-semibold mb-4">
          {t("title")}
        </h2>
        <input
          type="email"
          className="w-full mb-4 p-2 border border-cyan-800 rounded"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border  border-cyan-800 rounded"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
          style={{ cursor: "pointer" }}
          onClick={handleLogin}
          disabled={loading}>
          {loading ? t("loading") : t("button")}
        </button>
        {error && <p className="mt-3 text-sm text-cyan-950">{error}</p>}
      </div>
    </div>
  );
}
