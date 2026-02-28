import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContextShared';
import { toast } from 'react-toastify';

const GoogleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

const GlassInputWrapper = ({children}) => (
  <div
    className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const TestimonialCard = ({testimonial, delay}) => (
  <div
    className={`animate-testimonial ${delay} flex items-start gap-4 rounded-4xl glass-panel border border-white/5 p-5 w-72 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 bg-[#0c0c0e]/40`}>
    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <img
      src={testimonial.avatarSrc}
      className="h-12 w-12 object-cover rounded-2xl border border-white/10 shadow-lg"
      alt="avatar" />
    <div className="text-sm leading-snug relative z-10 w-full">
      <p className="flex items-center gap-1 font-bold text-white tracking-wide">{testimonial.name}</p>
      <p className="text-violet-400 text-[10px] font-black uppercase tracking-widest mt-0.5">{testimonial.handle}</p>
      <p className="mt-2.5 text-gray-300 font-medium text-xs leading-relaxed italic">"{testimonial.text}"</p>
    </div>
  </div>
);

const SignInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email: data.email,
        password: data.password
      }, {
        withCredentials: true
      });
      login(response.data.user);
      toast.success("User logged in successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const heroImageSrc = "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2532&auto=format&fit=crop"; 
  const testimonials = [
      {
          name: "Alice Johnson",
          handle: "@alice_j",
          text: "This platform has revolutionized my workflow!",
          avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg"
      },
       {
          name: "Bob Smith",
          handle: "@bob_builder",
          text: "I can't imagine working without it anymore.",
          avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg"
      }
  ]; 

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans w-full bg-[#0c0c0e] text-foreground relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#0c0c0e]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>
          {/* Glossy radial lighting setup */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
      </div>
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-[440px] relative">
          {/* Ambient Glow behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col gap-6 premium-card p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-white/5 backdrop-blur-3xl">
            {/* Soft inner highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-white/5 blur-2xl pointer-events-none rounded-full" />
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                   <img src="/rolepilotai.svg" alt="Logo" className="w-8 h-8 opacity-90" />
                </div>
                <h1 className="animate-element animate-delay-100 text-white text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  Welcome Back
                </h1>
                <p className="animate-element animate-delay-200 text-gray-400 mt-2 text-sm font-medium">Access your account and continue your journey.</p>
              </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="animate-element animate-delay-300">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                <GlassInputWrapper>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none placeholder:text-gray-600 text-white" />
                </GlassInputWrapper>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="animate-element animate-delay-400">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[11px] text-violet-400 hover:text-violet-300 font-bold transition-colors">Forgot?</a>
                </div>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      {...register("password", { required: "Password is required" })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none placeholder:text-gray-600 text-white" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer active:scale-90 transition-transform duration-200">
                      {showPassword ? <EyeOff
                        className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /> : <Eye
                        className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-600 w-full rounded-2xl bg-violet-600 text-white py-4 font-black hover:bg-violet-500 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] cursor-pointer active:scale-95 text-xs uppercase tracking-[0.2em] mt-2">
                Sign In To Account
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center my-2">
              <span className="w-full border-t border-white/5"></span>
              <span className="px-4 text-[10px] uppercase font-bold tracking-widest text-gray-500 bg-transparent absolute backdrop-blur-md pb-0.5">Or Continue With</span>
            </div>

            <a href={`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-white/5 rounded-2xl py-3.5 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer active:scale-95 text-white shadow-lg">
                <GoogleIcon />
                <span className="text-xs font-bold uppercase tracking-wider">Google</span>
            </a>

            <p className="animate-element animate-delay-900 text-center text-xs text-gray-500 font-medium mt-2">
              New to our platform? <a href="/register" className="text-violet-400 hover:text-violet-300 hover:underline transition-colors font-bold ml-1">Create Account</a>
            </p>
            
            </div>
          </div>
        </div>
      </section>
      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-6 bg-transparent z-10">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-6 rounded-[3rem] bg-cover bg-center border border-white/5 overflow-hidden shadow-2xl"
            style={{ backgroundImage: `url(${heroImageSrc})` }}>
                <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.2)_0%,transparent_60%)] mix-blend-screen" />
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            </div>
          
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-6 px-8 w-full justify-center z-20">
            {testimonials.map((t, i) => (
                 <div key={i} className={i > 0 ? "hidden xl:block" : ""}><TestimonialCard testimonial={t} delay={`delay-${(i+5)*100}`} /></div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export default SignInPage;
