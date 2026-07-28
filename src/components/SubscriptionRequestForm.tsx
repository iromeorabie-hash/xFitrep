import React, { useState } from "react";
import { Sparkles, CreditCard, Send, AlertCircle, CheckCircle } from "lucide-react";

interface SubscriptionRequestFormProps {
  onSuccess: (plan: "Basic" | "Premium" | "Elite", paymentRef: string, notes?: string) => Promise<void> | void;
  lang: "en" | "ar";
}

export default function SubscriptionRequestForm({ onSuccess, lang }: SubscriptionRequestFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<"Basic" | "Premium" | "Elite">("Premium");
  const [paymentRef, setPaymentRef] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isRtl = lang === "ar";

  const plans = [
    {
      id: "Basic" as const,
      nameEn: "Basic Plan",
      nameAr: "الباقة الأساسية",
      durationEn: "1 Month (30 Days)",
      durationAr: "شَهر (٣٠ يوم)",
      descEn: "Full access to standard workout library.",
      descAr: "وصول كامل لمكتبة التمارين القياسية.",
    },
    {
      id: "Premium" as const,
      nameEn: "Premium Plan",
      nameAr: "الباقة المميزة",
      durationEn: "3 Months (90 Days)",
      durationAr: "٣ أشهر (٩٠ يوم)",
      descEn: "Our most popular coaching plan for sustained results.",
      descAr: "الباقة الأكثر شيوعاً لنتائج مستمرة واحترافية.",
    },
    {
      id: "Elite" as const,
      nameEn: "Elite Plan",
      nameAr: "باقة النخبة",
      durationEn: "1 Year (365 Days)",
      durationAr: "سنة كاملة (٣٦٥ يوم)",
      descEn: "Unhindered VIP tutorial access and form reviews.",
      descAr: "وصول كبار الشخصيات غير المحدود ومراجعات الأداء.",
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!paymentRef.trim()) {
      setErrorMsg(
        lang === "en"
          ? "Please provide a payment transfer reference or receipt number."
          : "يرجى تقديم مرجع تحويل الدفع أو رقم الإيصال."
      );
      return;
    }

    setIsLoading(true);
    try {
      await onSuccess(selectedPlan, paymentRef.trim(), notes.trim() || undefined);
      setSuccessMsg(
        lang === "en"
          ? "Subscription request submitted successfully!"
          : "تم إرسال طلب الاشتراك بنجاح!"
      );
      setPaymentRef("");
      setNotes("");
    } catch (err: any) {
      setErrorMsg(err.message || (lang === "en" ? "Failed to submit request." : "فشل في إرسال الطلب."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-5 md:p-6 text-left space-y-5 animate-in fade-in" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
        <CreditCard className="w-5 h-5 text-emerald-400" />
        <h4 className="text-sm font-black text-white uppercase tracking-wider">
          {lang === "en" ? "Submit Subscription Request" : "تقديم طلب الاشتراك"}
        </h4>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Plan Select Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 block">
            {lang === "en" ? "1. Select Desired Plan" : "١. اختر الباقة المطلوبة"}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/5"
                      : "bg-zinc-900/60 border-zinc-850 hover:border-zinc-750 text-zinc-400"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-zinc-950 rounded-full p-0.5">
                      <Sparkles className="w-3 h-3" />
                    </span>
                  )}
                  <div>
                    <span className="text-xs font-black block text-white">
                      {lang === "en" ? p.nameEn : p.nameAr}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5 font-bold">
                      {lang === "en" ? p.durationEn : p.durationAr}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 leading-tight">
                    {lang === "en" ? p.descEn : p.descAr}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Reference Input */}
        <div className="space-y-1.5">
          <label htmlFor="sub-payment-ref" className="text-xs font-bold text-zinc-400 block">
            {lang === "en" ? "2. Bank Transfer / Transaction ID" : "٢. مرجع تحويل البنك / رقم المعاملة"}
          </label>
          <input
            id="sub-payment-ref"
            type="text"
            required
            placeholder={
              lang === "en"
                ? "e.g. TX102939281 or Cash receipt ID"
                : "مثال: رقم الحوالة أو إيصال السداد الناري"
            }
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all"
          />
          <p className="text-[10px] text-zinc-500">
            {lang === "en"
              ? "Include the transaction number or transfer reference code for our coach to verify."
              : "يرجى كتابة رقم الحوالة أو رمز التحويل لتمكين الكوتش من تفعيل الاشتراك بعد المراجعة."}
          </p>
        </div>

        {/* Customer Notes */}
        <div className="space-y-1.5">
          <label htmlFor="sub-notes" className="text-xs font-bold text-zinc-400 block">
            {lang === "en" ? "3. Additional Notes (Optional)" : "٣. ملاحظات إضافية (اختياري)"}
          </label>
          <textarea
            id="sub-notes"
            rows={2}
            placeholder={
              lang === "en"
                ? "e.g. Sent from AlRajhi bank account, please activate custom dates if applicable."
                : "مثال: تم التحويل من بنك الراجحي باسم بلال، يرجى تفعيل المدة المخصصة."
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-850 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white rounded-xl py-2.5 px-4 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          id="sub-request-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl tracking-wide transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>
            {isLoading
              ? lang === "en" ? "Sending Request..." : "جاري إرسال الطلب..."
              : lang === "en" ? "Submit Plan Request" : "إرسال طلب تفعيل الباقة"}
          </span>
        </button>
      </form>
    </div>
  );
}
