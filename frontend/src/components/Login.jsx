import React from 'react'
import { loginStyles } from '../assets/dummyStyle'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, LogIn, Mail, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';
const isValidEmail = (email) => {
    // allow letters, numbers and . _ % + - before @, domain with letters/numbers/dots/hyphens and a TLD of at least 2 letters
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return re.test(email);
}

const Login = ({ onLoginSuccess = null }) => {

    const navigate = useNavigate()
    const handlesubmit = async (ev) => {
        ev.preventDefault()
        setsubmitError('')
        const validation = validate()
        seterror(validation)
        if (Object.keys(validation).length > 0) {
            return
        }
        setloading(true)
        try {
            const payload = {
                email : email.trim().toLowerCase(),
                password
            }
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(payload)
            })
            let data = null;
            try {
               data = await res.json() 
            } catch (error) {
                console.error('Error parsing JSON:', error)
            }

            if (!res.ok) {
        
                setsubmitError(data?.message || 'Login failed. Please try again.')
               return;
            }
            if(data?.token){
                try{
                    localStorage.setItem('authToken',data.token)
                    localStorage.setItem(
                        'currentuser',JSON.stringify(data.user || {email : payload.email} )
                    )
                } catch (error) {
                   //ignore the error
                }
            }
            const user = data?.user || {email : payload.email}
            window.dispatchEvent(new CustomEvent('authChanged', {detail : {user}}))
            if(onLoginSuccess && typeof onLoginSuccess === 'function'){
                onLoginSuccess(user)
            }
            navigate('/', {replace : true})
        } catch (error) {
            console.error('Error logging in:', error)
            setsubmitError('Login failed. Please try again.')
        }
        finally{
            setloading(false)
        }
    }
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [showpassword, setshowpassword] = useState(false)
    const [error, seterror] = useState({})
    const [loading, setloading] = useState(false)
    const [submitError, setsubmitError] = useState('')

    const API_BASE = 'http://localhost:5000'

    const validate = () => {
        const e = {}
        if (!email) {
            e.email = "Email is required"
        }
        else if (!isValidEmail(email)) e.email = 'please enter a vaild Eail'
        if (!password) e.password = 'password is required'
        return e;

    }


    return (
        <div className={loginStyles.pageContainer}>
            <div className={loginStyles.bubble1}></div>
            <div className={loginStyles.bubble2}></div>

            <Link to={'/'} className={loginStyles.backButton}>
                <ArrowLeft className={loginStyles.backButtonIcon} />
                <span className={loginStyles.backButtonText}>Home</span>
            </Link>
            {/* this part is creating problem  */}
            <div className={loginStyles.formContainer}>
                <form onSubmit={handlesubmit} className={loginStyles.form} noValidate>
                    <div className={loginStyles.formWrapper}>
                        <div className={loginStyles.animatedBorder}>
                            <div className={loginStyles.formContent}>
                                <h2 className={loginStyles.heading}>
                                    <span className={loginStyles.headingIcon}>
                                        <LogIn className={loginStyles.headingIconInner} />
                                    </span>
                                    <span className={loginStyles.headingText}>Log In</span>
                                </h2>
                                <p className={loginStyles.subtitle}>
                                    Sign in to continue with the Quiz
                                </p>
                                <label className={loginStyles.label}>
                                    <span className={loginStyles.labelText}>Email </span>
                                    <div className={loginStyles.inputContainer}>
                                        <span className={loginStyles.inputIcon}>
                                            <Mail className={loginStyles.inputIconInner} />
                                        </span>
                                        <input type='email' id="Email"
                                            className={`${loginStyles.input} ${error.email ? loginStyles.inputError : loginStyles.inputNormal}`} value={email}
                                            onChange={(e) => {
                                                setemail(e.target.value);
                                                if (error.email)
                                                    seterror((s) => ({
                                                        ...s, email: undefined,
                                                    }))
                                            }}
                                            placeholder='Your@emailhere.com'
                                            required />
                                    </div>
                                    {error.email && (<p className={loginStyles.errorText}>
                                        {error.email}
                                    </p>)}
                                </label>

                                {/* for password */}
                                <label className={loginStyles.label}>
                                    <span className={loginStyles.labelText}>Pasword </span>
                                    <div className={loginStyles.inputContainer}>
                                        <span className={loginStyles.inputIcon}>
                                            <Lock className={loginStyles.inputIconInner} />
                                        </span>
                                        <input type={showpassword ? "text" : "password"} id="Password"
                                            className={`${loginStyles.input} ${loginStyles.passwordInput} ${error.password ? loginStyles.inputError : loginStyles.inputNormal}`} value={password}
                                            onChange={(e) => {
                                                setpassword(e.target.value);
                                                if (error.password)
                                                    seterror((s) => ({
                                                        ...s, password: undefined,
                                                    }))
                                            }}
                                            placeholder='Password'
                                            required />
                                        {/* toggle password visibility */}
                                        <button type='button' className={loginStyles.passwordToggle} onClick={() => setshowpassword((s) => !s)}>
                                            {showpassword ? <EyeOff className={loginStyles.passwordToggleIcon} /> : <Eye className={loginStyles.passwordToggleIcon} />}
                                        </button>
                                    </div>
                                    {error.password && (<p className={loginStyles.errorText}>
                                        {error.password}
                                    </p>)}
                                </label>

                                        {submitError && (
                                            <p className={loginStyles.submitError}>
                                                {submitError}
                                            </p>
                                        )}
                                <div className={loginStyles.buttonsContainer}>
                                    <button type='submit' className={loginStyles.submitButton}
                                    disabled={loading} >
                                                {loading?(
                                                    'Singing In...'
                                                ):(
                                                 <> <LogIn className={loginStyles.submitButtonIcon} />
                                                    <span className={loginStyles.submitButtonText}>
                                                        Sing In
                                                    </span>
                                                    </>  
                                                )}
                                    </button>

                                                <div className={loginStyles.signupContainer}>
                                                    <div className={loginStyles.signupContent}>
                                                        <spa  className={loginStyles.signupText}>Don't have an account</spa>
                                                            <Link to={'/signup'}className={loginStyles.signupLink}>
                                                    Crate a account
                                                            </Link>
                                                    </div>
                                                </div>


                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <style>{loginStyles.animations}</style>
        </div>
    )
}

export default Login
