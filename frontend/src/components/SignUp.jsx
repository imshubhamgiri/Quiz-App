import React, { useState } from 'react'
import { signupStyles } from '../assets/dummyStyle'
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
// allow letters, numbers and . _ % + - before @, domain with letters/numbers/dots/hyphens and a TLD of at least 2 letters


const SignUp = ({ onSignUpSuccess = null }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setloading] = useState(false)

  const validate = () => {
    const e = {};
    if (!name.trim()) {
      e.name = 'Name is required!';
    }
    if (!email) {
      e.email = 'Email is required!';
    } else if (!isValidEmail(email)) {
      e.email = 'Please enter a valid email.';
    }
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters!';
    }
    return e;
  };
  const API_BASE = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length ) {
      return;
    }
    setloading(true)
    try {
      const payload = { name: name.trim(), email: email.trim().toLowerCase(), password };
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      let data = null;

      try {
        data = await response.json();
      } catch (error) {
       //ignore;
      }

      if (!response.ok) {
        setSubmitError(data?.message || 'Register failed');
        return;
      }

      // On successful registration
      if (data?.token) {
        try {
          localStorage.setItem('authToken', data.token)
          localStorage.setItem(
            'currentuser', JSON.stringify(data.user || { name: name.trim(), email: email.trim().toLowerCase() })
          )
        } catch (error) {
          //ignore the error
        }
      }
      // const user = data?.user || {email : payload.email}
      // window.dispatchEvent(new CustomEvent('authChanged', {detail : {user}}))
      if (onSignUpSuccess && typeof onSignUpSuccess === 'function') {
        try {
          onSignUpSuccess(
            data.user || { name: name.trim(), email: email.trim().toLowerCase() }
          )
        } catch (error) {
          //ignore the error
        }
      }
      navigate('/login', { replace: true })



    } catch (error) {
      console.error('Error during registration:', error);
      setSubmitError('Network error');
    } finally {
      setloading(false);
    }


  };

  return (
    <div className={signupStyles.pageContainer}>
      <Link to={'/login'} className={signupStyles.backButton}>
        <ArrowLeft className={signupStyles.backButtonIcon} />
        <span className={signupStyles.backButtonText}>Back</span>
      </Link>
      <div className={signupStyles.formContainer}>
        <form action="" onSubmit={handleSubmit}>
          <div className={signupStyles.animatedBorder}>
            <div className={signupStyles.formContent}>
              <h2 className={signupStyles.heading}>
                <span className={signupStyles.headingIcon}>
                  <CheckCircle className={signupStyles.headingIconInner} />
                </span>
                <span className={signupStyles.headingText}>Create Account</span>
              </h2>
              <p className={signupStyles.subtitle}>
                Sign up to get started!
              </p>
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>
                  Full Name
                </span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <User className={signupStyles.inputIconInner} />
                  </span>
                  <input type="text" name='name' value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name)
                        setErrors((s) => ({ ...s, name: undefined }))
                    }} className={`${signupStyles.input} 
                  ${errors.name ? signupStyles.inputError :
                        signupStyles.inputNormal}`} placeholder='John doe' required />
                </div>
                {errors.name && <p className={signupStyles.errorText}>{errors.name}</p>}

              </label>

              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>
                  Email Address
                </span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <Mail className={signupStyles.inputIconInner} />
                  </span>
                  <input type="email" name='email' value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email)
                        setErrors((s) => ({ ...s, email: undefined }))
                    }} className={`${signupStyles.input} 
                  ${errors.email ? signupStyles.inputError :
                        signupStyles.inputNormal}`} placeholder='John@example.com' required />
                </div>
                {errors.email && <p className={signupStyles.errorText}>{errors.email}</p>}

              </label>
              {/* Password field */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>
                  Password
                </span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <Lock className={signupStyles.inputIconInner} />
                  </span>
                  <input type={showPassword ? "text" : "password"} name='password' value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password)
                        setErrors((s) => ({ ...s, password: undefined }))
                    }} className={`${signupStyles.input}  ${signupStyles.passwordInput}
                  ${errors.password ? signupStyles.inputError :
                        signupStyles.inputNormal}`} placeholder='Enter you password' required />
                  {/* toggle password visibility */}
                  <button type='button' className={signupStyles.passwordToggle} onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <EyeOff className={signupStyles.passwordToggleIcon} /> : <Eye className={signupStyles.passwordToggleIcon} />}
                  </button>
                </div>
                {errors.password && <p className={signupStyles.errorText}>{errors.password}</p>}

              </label>

              {submitError && (
                <p className={signupStyles.submitError} role="alert">
                  {submitError}
                </p>
              )}
              <div className={signupStyles.buttonContainer}>
                <button type="submit" className={signupStyles.submitButton} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
              <p className={signupStyles.loginPrompt}>
                Already have an account?{' '}
                <Link to={'/login'} className={signupStyles.loginLink}>
                  Log In
                </Link>
              </p>





            </div>
          </div>
        </form>
          <div className={signupStyles.loginPromptContainer}>
              <div className={signupStyles.loginPromptContent}>
                <span className={signupStyles.loginPromptText}>
                  Already have an account?
                </span>
                  <Link to={'/login'} className={signupStyles.loginPromptLink}>
                    Log In
                  </Link>
              </div>
              </div>

      </div>
        <style>{signupStyles.animations}</style>
    </div>

  )
}


export default SignUp
