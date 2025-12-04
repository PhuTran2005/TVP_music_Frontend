import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

const AnimatedBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#08080a]">
    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[100px] animate-blob mix-blend-screen" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
  </div>
);

export default function ForgotPasswordPage() {
  return (
    <>
      <style>{`
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 10s infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { -webkit-text-fill-color: white !important; -webkit-box-shadow: 0 0 0 0 transparent inset !important; transition: background-color 9999s ease-in-out 0s; }
      `}</style>

      <div className="min-h-screen w-full flex bg-[#08080a] text-white font-sans selection:bg-indigo-500/30 overflow-hidden items-center justify-center">
        <AnimatedBackground />

        <div className="relative z-10 w-full max-w-[480px] p-6 sm:p-12">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
