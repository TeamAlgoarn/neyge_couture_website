// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { authService } from '@/lib/auth';
// import { toast } from 'sonner';
// import { Mail, Lock, User, Sparkles } from 'lucide-react';

// const C = {
//   maroon: '#800020', gold: '#C4980A', goldV: '#D4AF37',
//   warmGrey: '#4a3828', creamLt: '#FFF9F0',
// };

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

// .ln-root {
//   font-family:'Jost',sans-serif;
//   background: linear-gradient(160deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
//   min-height:100vh;color:#1a1010;line-height:1;
//   display:flex;align-items:center;justify-content:center;
//   padding:140px 16px 60px;
// }
// @media(max-width:640px){.ln-root{padding-top:110px;}}

// /* BG decoration */
// .ln-orb-a {
//   position:fixed;top:10%;left:5%;width:300px;height:300px;border-radius:50%;
//   background:radial-gradient(circle,rgba(196,152,10,.07) 0%,transparent 70%);
//   pointer-events:none;
// }
// .ln-orb-b {
//   position:fixed;bottom:10%;right:5%;width:380px;height:380px;border-radius:50%;
//   background:radial-gradient(circle,rgba(128,0,32,.06) 0%,transparent 70%);
//   pointer-events:none;
// }

// /* ANIMATIONS */
// @keyframes lnFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
// @keyframes lnScaleIn {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
// @keyframes lnShimmer {0%{left:-80%}100%{left:120%}}

// .ln-fadein {animation:lnScaleIn .7s cubic-bezier(.4,0,.2,1) both;}
// .ln-fadeup {animation:lnFadeUp  .8s cubic-bezier(.4,0,.2,1) both;}
// .ln-d1{animation-delay:.12s}

// /* CARD WIDTH */
// .ln-card-wrap { width:100%;max-width:440px; }

// /* HEADER */
// .ln-header { text-align:center;margin-bottom:32px; }
// .ln-badge {
//   display:inline-flex;align-items:center;gap:8px;
//   background:rgba(196,152,10,.12);border:1px solid rgba(196,152,10,.35);
//   padding:7px 18px;border-radius:100px;margin-bottom:18px;
// }
// .ln-title {
//   font-family:'Cormorant Garamond',serif;
//   font-size:clamp(34px,6vw,50px);font-weight:400;color:#800020;
//   line-height:1.06;margin-bottom:10px;
// }
// .ln-sub {
//   font-family:'Jost';font-size:14px;font-weight:300;
//   color:#4a3828;line-height:1.7;
// }
// .ln-gd { width:48px;height:1px;background:#C4980A;margin:14px auto 0; }

// /* CARD */
// .ln-card {
//   background:rgba(255,249,240,.97);backdrop-filter:blur(12px);
//   border:1px solid rgba(196,152,10,.25);border-radius:28px;
//   padding:38px 36px 32px;
//   box-shadow:0 24px 80px rgba(0,0,0,.1);
// }
// @media(max-width:480px){.ln-card{padding:28px 20px 26px;border-radius:22px;}}

// /* FIELD */
// .ln-field { margin-bottom:20px; }
// .ln-label {
//   font-family:'Jost';font-size:11px;letter-spacing:.15em;
//   text-transform:uppercase;color:#C4980A;font-weight:600;
//   display:block;margin-bottom:8px;
// }
// .ln-input-wrap { position:relative; }
// .ln-input-icon {
//   position:absolute;left:16px;top:50%;transform:translateY(-50%);
//   pointer-events:none;
// }
// .ln-input {
//   width:100%;padding:14px 16px 14px 46px;
//   background:white;border:1.5px solid rgba(196,152,10,.3);border-radius:100px;
//   font-family:'Jost';font-size:14px;color:#1a1010;
//   transition:border-color .25s,box-shadow .25s;line-height:1;
// }
// .ln-input::placeholder{color:#b0a090;font-weight:300;}
// .ln-input:focus{
//   outline:none;border-color:#C4980A;
//   box-shadow:0 0 0 3px rgba(196,152,10,.12);
// }

// /* SUBMIT BUTTON */
// .ln-submit {
//   width:100%;padding:15px;border:none;border-radius:100px;
//   background:linear-gradient(135deg,#D4AF37 0%,#b8960f 100%);
//   color:#800020;
//   font-family:'Jost';font-size:13px;letter-spacing:.12em;
//   font-weight:600;text-transform:uppercase;cursor:pointer;
//   transition:transform .35s,box-shadow .35s;
//   box-shadow:0 6px 24px rgba(212,175,55,.38);
//   position:relative;overflow:hidden;margin-top:8px;
// }
// .ln-submit::after{
//   content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
//   background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
//   animation:lnShimmer 3s ease infinite;
// }
// .ln-submit:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(212,175,55,.52);}

// /* TOGGLE */
// .ln-toggle-row { text-align:center;margin-top:22px;padding-top:18px;border-top:1px solid rgba(196,152,10,.18); }
// .ln-toggle-btn {
//   font-family:'Jost';font-size:13px;font-weight:500;
//   color:#800020;background:none;border:none;cursor:pointer;
//   transition:color .2s;
// }
// .ln-toggle-btn:hover{color:#C4980A;}

// /* BACK LINK */
// .ln-back {
//   display:block;text-align:center;margin-top:18px;
//   font-family:'Jost';font-size:12px;letter-spacing:.08em;
//   color:#9a8070;text-decoration:none;transition:color .2s;
// }
// .ln-back:hover{color:#800020;}
// `;

// export function LoginPage() {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isLogin) {
//       const user = authService.login(formData.email, formData.password);
//       if (user) { toast.success('Welcome back!'); navigate('/'); }
//     } else {
//       authService.register(formData.name, formData.email, formData.password);
//       toast.success('Account created successfully!'); navigate('/');
//     }
//   };

//   const FIELDS = [
//     ...(!isLogin ? [{ key: 'name'    as const, type: 'text',     label: 'Full Name',      placeholder: 'Enter your name',     Icon: User }] : []),
//     {              key: 'email'   as const, type: 'email',    label: 'Email Address',  placeholder: 'Enter your email',    Icon: Mail },
//     {              key: 'password'as const, type: 'password', label: 'Password',       placeholder: 'Enter your password', Icon: Lock },
//   ];

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="ln-root">
//         <div className="ln-orb-a" /><div className="ln-orb-b" />

//         <div className="ln-card-wrap">

//           {/* Header */}
//           <div className="ln-header ln-fadeup">
//             <div className="ln-badge">
//               <Sparkles size={13} color={C.gold} />
//               <span style={{ fontFamily: "'Jost'", fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: C.gold, fontWeight: 600 }}>
//                 Artisan Heritage
//               </span>
//             </div>
//             <h1 className="ln-title">
//               {isLogin ? 'Welcome Back' : 'Create Account'}
//             </h1>
//             <p className="ln-sub">
//               {isLogin
//                 ? 'Sign in to access your account'
//                 : 'Join us to explore handcrafted sarees'}
//             </p>
//             <span className="ln-gd" />
//           </div>

//           {/* Card */}
//           <div className="ln-card ln-fadein ln-d1">
//             <form onSubmit={handleSubmit}>
//               {FIELDS.map(({ key, type, label, placeholder, Icon }) => (
//                 <div key={key} className="ln-field">
//                   <label className="ln-label">{label}</label>
//                   <div className="ln-input-wrap">
//                     <div className="ln-input-icon">
//                       <Icon size={16} color={C.gold} />
//                     </div>
//                     <input
//                       type={type}
//                       required
//                       placeholder={placeholder}
//                       value={formData[key]}
//                       onChange={e => setFormData({ ...formData, [key]: e.target.value })}
//                       className="ln-input"
//                     />
//                   </div>
//                 </div>
//               ))}

//               <button type="submit" className="ln-submit">
//                 {isLogin ? 'Sign In ✦' : 'Create Account ✦'}
//               </button>
//             </form>

//             <div className="ln-toggle-row">
//               <button className="ln-toggle-btn" onClick={() => setIsLogin(p => !p)}>
//                 {isLogin
//                   ? "Don't have an account? Sign up →"
//                   : 'Already have an account? Sign in →'}
//               </button>
//             </div>
//           </div>

//           <Link to="/" className="ln-back">← Back to home</Link>
//         </div>
//       </div>
//     </>
//   );
// }



import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { Mail, Lock, User, Sparkles, Phone } from 'lucide-react';

const C = {
  maroon: '#800020',
  gold: '#C4980A',
  goldV: '#D4AF37',
  warmGrey: '#4a3828',
  creamLt: '#FFF9F0',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.ln-root {
  font-family:'Jost',sans-serif;
  background: linear-gradient(160deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
  min-height:100vh;color:#1a1010;line-height:1;
  display:flex;align-items:center;justify-content:center;
  padding:140px 16px 60px;
}
@media(max-width:640px){.ln-root{padding-top:110px;}}

.ln-orb-a {
  position:fixed;top:10%;left:5%;width:300px;height:300px;border-radius:50%;
  background:radial-gradient(circle,rgba(196,152,10,.07) 0%,transparent 70%);
  pointer-events:none;
}
.ln-orb-b {
  position:fixed;bottom:10%;right:5%;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(128,0,32,.06) 0%,transparent 70%);
  pointer-events:none;
}

@keyframes lnFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes lnScaleIn {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes lnShimmer {0%{left:-80%}100%{left:120%}}

.ln-fadein {animation:lnScaleIn .7s cubic-bezier(.4,0,.2,1) both;}
.ln-fadeup {animation:lnFadeUp  .8s cubic-bezier(.4,0,.2,1) both;}
.ln-d1{animation-delay:.12s}

.ln-card-wrap { width:100%;max-width:440px; }

.ln-header { text-align:center;margin-bottom:32px; }
.ln-badge {
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(196,152,10,.12);border:1px solid rgba(196,152,10,.35);
  padding:7px 18px;border-radius:100px;margin-bottom:18px;
}
.ln-title {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(34px,6vw,50px);font-weight:400;color:#800020;
  line-height:1.06;margin-bottom:10px;
}
.ln-sub {
  font-family:'Jost';font-size:14px;font-weight:300;
  color:#4a3828;line-height:1.7;
}
.ln-gd { width:48px;height:1px;background:#C4980A;margin:14px auto 0; }

.ln-card {
  background:rgba(255,249,240,.97);backdrop-filter:blur(12px);
  border:1px solid rgba(196,152,10,.25);border-radius:28px;
  padding:38px 36px 32px;
  box-shadow:0 24px 80px rgba(0,0,0,.1);
}
@media(max-width:480px){.ln-card{padding:28px 20px 26px;border-radius:22px;}}

.ln-field { margin-bottom:20px; }
.ln-label {
  font-family:'Jost';font-size:11px;letter-spacing:.15em;
  text-transform:uppercase;color:#C4980A;font-weight:600;
  display:block;margin-bottom:8px;
}
.ln-input-wrap { position:relative; }
.ln-input-icon {
  position:absolute;left:16px;top:50%;transform:translateY(-50%);
  pointer-events:none;
}
.ln-input {
  width:100%;padding:14px 16px 14px 46px;
  background:white;border:1.5px solid rgba(196,152,10,.3);border-radius:100px;
  font-family:'Jost';font-size:14px;color:#1a1010;
  transition:border-color .25s,box-shadow .25s;line-height:1;
}
.ln-input::placeholder{color:#b0a090;font-weight:300;}
.ln-input:focus{
  outline:none;border-color:#C4980A;
  box-shadow:0 0 0 3px rgba(196,152,10,.12);
}

.ln-submit {
  width:100%;padding:15px;border:none;border-radius:100px;
  background:linear-gradient(135deg,#D4AF37 0%,#b8960f 100%);
  color:#800020;
  font-family:'Jost';font-size:13px;letter-spacing:.12em;
  font-weight:600;text-transform:uppercase;cursor:pointer;
  transition:transform .35s,box-shadow .35s,opacity .2s;
  box-shadow:0 6px 24px rgba(212,175,55,.38);
  position:relative;overflow:hidden;margin-top:8px;
}
.ln-submit::after{
  content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
  animation:lnShimmer 3s ease infinite;
}
.ln-submit:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(212,175,55,.52);}
.ln-submit:disabled{opacity:.7;cursor:not-allowed;transform:none;}

.ln-toggle-row { text-align:center;margin-top:22px;padding-top:18px;border-top:1px solid rgba(196,152,10,.18); }
.ln-toggle-btn {
  font-family:'Jost';font-size:13px;font-weight:500;
  color:#800020;background:none;border:none;cursor:pointer;
  transition:color .2s;
}
.ln-toggle-btn:hover{color:#C4980A;}

.ln-back {
  display:block;text-align:center;margin-top:18px;
  font-family:'Jost';font-size:12px;letter-spacing:.08em;
  color:#9a8070;text-decoration:none;transition:color .2s;
}
.ln-back:hover{color:#800020;}
`;

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const user = await authService.login(formData.email, formData.password);

        if (user) {
          toast.success('Welcome back!');
          navigate('/');
        } else {
          toast.error('Invalid login credentials');
        }
      } else {
        if (!formData.name.trim()) {
          toast.error('Full name is required');
          setLoading(false);
          return;
        }

        if (!formData.phone.trim()) {
          toast.error('Phone number is required');
          setLoading(false);
          return;
        }

        await authService.register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );

        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error: any) {
      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail) && detail.length > 0) {
        toast.error(detail[0]?.msg || 'Validation failed');
      } else {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'Something went wrong. Please try again.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    ...(!isLogin
      ? [
          {
            key: 'name' as const,
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your name',
            Icon: User,
          },
          {
            key: 'phone' as const,
            type: 'text',
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            Icon: Phone,
          },
        ]
      : []),
    {
      key: 'email' as const,
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      Icon: Mail,
    },
    {
      key: 'password' as const,
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      Icon: Lock,
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="ln-root">
        <div className="ln-orb-a" />
        <div className="ln-orb-b" />

        <div className="ln-card-wrap">
          <div className="ln-header ln-fadeup">
            <div className="ln-badge">
              <Sparkles size={13} color={C.gold} />
              <span
                style={{
                  fontFamily: "'Jost'",
                  fontSize: 11,
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color: C.gold,
                  fontWeight: 600,
                }}
              >
                Artisan Heritage
              </span>
            </div>
            <h1 className="ln-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="ln-sub">
              {isLogin
                ? 'Sign in to access your account'
                : 'Join us to explore handcrafted sarees'}
            </p>
            <span className="ln-gd" />
          </div>

          <div className="ln-card ln-fadein ln-d1">
            <form onSubmit={handleSubmit}>
              {FIELDS.map(({ key, type, label, placeholder, Icon }) => (
                <div key={key} className="ln-field">
                  <label className="ln-label">{label}</label>
                  <div className="ln-input-wrap">
                    <div className="ln-input-icon">
                      <Icon size={16} color={C.gold} />
                    </div>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="ln-input"
                    />
                  </div>
                </div>
              ))}

              <button type="submit" className="ln-submit" disabled={loading}>
                {loading
                  ? isLogin
                    ? 'Signing In...'
                    : 'Creating Account...'
                  : isLogin
                  ? 'Sign In ✦'
                  : 'Create Account ✦'}
              </button>
            </form>

            <div className="ln-toggle-row">
              <button
                type="button"
                className="ln-toggle-btn"
                onClick={() => setIsLogin((p) => !p)}
                disabled={loading}
              >
                {isLogin
                  ? "Don't have an account? Sign up →"
                  : 'Already have an account? Sign in →'}
              </button>
            </div>
          </div>

          <Link to="/" className="ln-back">
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  );
}