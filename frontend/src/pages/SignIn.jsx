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

const TestimonialCard = ({testimonial,delay}) => (
  <div
    className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img
      src={testimonial.avatarSrc}
      className="h-10 w-10 object-cover rounded-2xl"
      alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
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
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: data.email,
        password: data.password
      }, {
        withCredentials: true
      });
      console.log(response.data);
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
    <div className="min-h-screen flex flex-col md:flex-row font-sans w-full bg-[#0f1115] text-foreground relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1
              className="animate-element animate-delay-100 text-white text-4xl md:text-5xl font-semibold leading-tight">
                <span className="font-light tracking-tighter">Welcome Back</span>
              </h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">Access your account and continue your journey with us</p>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <GlassInputWrapper>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none placeholder:text-muted-foreground/50" />
                </GlassInputWrapper>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      {...register("password", { required: "Password is required" })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none placeholder:text-muted-foreground/50" />
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

              <div
                className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-gray-600 bg-transparent text-violet-500 focus:ring-violet-500/20" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  className="hover:underline text-violet-400 transition-colors active:text-violet-500">Reset password</a>
              </div>

              <button
                type="submit"
                
                className="animate-element animate-delay-600 w-full rounded-2xl bg-blue-500 text-white py-4 font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-white/10 cursor-pointer active:scale-95">
                Sign In
              </button>
            </form>

            <div
              className="animate-element animate-delay-700 relative flex items-center justify-center my-2">
              <span className="w-full border-t border-border"></span>
              <span className="px-4 text-xs uppercase tracking-widest text-muted-foreground bg-background absolute">Or continue with</span>
            </div>

            <button
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 bg-amber-50 hover:bg-white/50`  transition-all duration-200 cursor-pointer active:scale-95">
                <GoogleIcon />
                <span className="text-sm font-medium">Continue with Google</span>
            </button>

            <p
              className="animate-element animate-delay-900 text-center text-sm text-muted-foreground mt-4">
              New to our platform? <a
              href="/register"
              className="text-violet-400 hover:underline transition-colors font-medium">Create Account</a>
            </p>
          </div>
        </div>
      </section>
      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 bg-[#0f1115] z-10">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center border border-white/10 overflow-hidden"
            style={{ backgroundImage: `url(${heroImageSrc})` }}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            </div>
          
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
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
