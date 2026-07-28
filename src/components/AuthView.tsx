import React, { useState } from "react";
import { User, Phone, Lock, UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { TranslationSet } from "../data/translations";

interface AuthViewProps {
  t: TranslationSet;
  lang: "en" | "ar";
  onLogin: (phone: string, pass: string) => { success: boolean; error?: string };
  onRegister: (name: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  initialMode?: "login" | "register";
}

export default function AuthView({ t, lang, onLogin, onRegister, initialMode = "login" }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  
  // Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isRtl = lang === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!phone.trim() || !password.trim()) {
      setErrorMsg(lang === "en" ? "Please fill in all required fields." : "يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setErrorMsg(lang === "en" ? "Full Name is required for registration." : "الاسم الكامل مطلوب للتسجيل.");
        return;
      }
      
      const res = await onRegister(name, phone, password);
      if (res.success) {
        setSuccessMsg(
          lang === "en" 
            ? "Registration successful! Your account is now pending administrative approval." 
            : "تم التسجيل بنجاح! حسابك الآن بانتظار موافقة الإدارة تفعيل الباقة."
        );
        // Clear fields
        setName("");
        setPhone("");
        setPassword("");
        // After a brief moment, switch to login mode so they can test logging in
        setTimeout(() => {
          setMode("login");
          setErrorMsg("");
          setSuccessMsg("");
        }, 4000);
      } else {
        setErrorMsg(res.error || "Registration failed");
      }
    } else {
      const res = onLogin(phone, password);
      if (!res.success) {
        setErrorMsg(res.error || "Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        
        <div className="text-center space-y-2 mb-8 relative z-10">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === "login" ? t.authLoginTitle : t.authRegisterTitle}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {mode === "login" ? t.authLoginSub : t.authRegisterSub}
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-3">
            <UserPlus className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 block">{t.authNameLabel}</label>
              <div className="relative">
                <span className={`absolute inset-y-0 flex items-center text-zinc-500 ${isRtl ? "left-3" : "right-3"}`}>
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder={lang === "en" ? "e.g. John Doe" : "مثال: بلال الشامي"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white rounded-xl py-3 px-4 outline-none transition-all ${
                    isRtl ? "pl-10" : "pr-10"
                  }`}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">{t.authPhoneLabel}</label>
            <div className="relative">
              <span className={`absolute inset-y-0 flex items-center text-zinc-500 ${isRtl ? "left-3" : "right-3"}`}>
                <Phone className="w-4 h-4" />
              </span>
              <input
                id="auth-phone-input"
                type="tel"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white rounded-xl py-3 px-4 outline-none transition-all ${
                  isRtl ? "pl-10" : "pr-10"
                }`}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 block">{t.authPasswordLabel}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 flex items-center text-zinc-500 hover:text-zinc-300 ${isRtl ? "left-3" : "right-3"}`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <input
                id="auth-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-zinc-950 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white rounded-xl py-3 px-4 outline-none transition-all ${
                  isRtl ? "pl-10" : "pr-10"
                }`}
                required
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-xl tracking-wide transition-all shadow-md shadow-emerald-500/10 mt-2 cursor-pointer"
          >
            {mode === "login" ? t.authBtnLogin : t.authBtnRegister}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-850 text-center">
          <button
            id="auth-mode-toggle"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors font-medium"
          >
            {mode === "login" ? t.authNoAccount : t.authHasAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
