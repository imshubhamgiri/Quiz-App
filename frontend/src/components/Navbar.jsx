import React from 'react'
import { navbarStyles } from '../assets/dummyStyle'
import { Award , LogIn , LogOut ,X , Menu } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState ,useEffect } from 'react';

const Navbar = (logoSrc) => {
    const navigate = useNavigate();
    const [loggedIn, setloggedIn] = useState(false);
    const [menuOpen, setmenuOpen] = useState(false)
    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        setloggedIn(!!token);
      };

      checkAuth();
    }, []);

    //logout funciton
    const handleLogout =(params) => {
      try {
        localStorage.removeItem('authToken')
        localStorage.clear()
      } catch (error) {
        
      }
      window.dispatchEvent(
          new CustomEvent('authChanged',{detail: {user: null}})
      )
      setmenuOpen(false);

      try {
        navigate('/login')
      } catch (error) {
        window.location.href = '/login'
      }


    }

    
  return (
    <nav className={navbarStyles.nav}>
        <div
        style={{
            backgroundImage: navbarStyles.decorativePatternBackground,
        }}
        className={navbarStyles.decorativePattern}>

        </div>
        
        <div className={navbarStyles.bubble1}>

        </div>
        <div className={navbarStyles.bubble2}>

        </div>
        <div className={navbarStyles.bubble3}>

        </div>

        <div className={navbarStyles.container}>
            <div className={navbarStyles.logoContainer}>
                <Link to={'/'} className={navbarStyles.logoButton}>
                <div className={navbarStyles.logoInner}>
                    <img src={logoSrc || ''} alt="Logo" 
                    className={navbarStyles.logoImage}
                    />
                    </div>  
                </Link>
            </div>

             {/* Title Section */}
      <div className={navbarStyles.titleContainer}>
            <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>The QiUiz App</h1>
            </div>
                    </div>

            <div className={navbarStyles.desktopButtonsContainer}>
                <div className={navbarStyles.spacer}></div>

                <NavLink to={'/result'} className={navbarStyles.resultsButton}>
                   <Award className={navbarStyles.buttonIcon} />
                   My Result
                </NavLink>
                {loggedIn ? (
                    <button  onClick={handleLogout} className={navbarStyles.logoutButton}>
                       <LogOut className={navbarStyles.buttonIcon} />   Logout
                    </button>
                ):(
                    <NavLink  to={'/login'} className={navbarStyles.loginButton}>
                       <LogIn className={navbarStyles.buttonIcon} />  LogIn
                    </NavLink>
                )}
                </div>


                    {/* Mobile Menu */}
                <div className={navbarStyles.mobileMenuContainer}>
                    <button onClick={()=>setmenuOpen((s) => !s)} className={navbarStyles.menuToggleButton}>
                    {menuOpen?(<X className={navbarStyles.menuIcon}/>):(<Menu className={navbarStyles.menuIcon}/>)}
                    </button>
                      
                {/* Mobile Menu Items */}
                {menuOpen && (
                    <div className={navbarStyles.mobileMenuPanel}>
                        <ul className={navbarStyles.mobileMenuList}>
                           <li >
                            <NavLink to={'/result'} onClick={()=>setmenuOpen(false)}
                             className={navbarStyles.resultsButton}>
                            <Award className={navbarStyles.mobileMenuIcon} />
                            My Result
                        </NavLink></li>
                        {loggedIn ? (
                            <li><button onClick={handleLogout} className={navbarStyles.mobileMenuItem}>
                                <LogOut className={navbarStyles.mobileMenuIcon} /> Logout
                            </button></li>
                        ) : (
                            <li><NavLink to={'/login'} className={navbarStyles.mobileMenuItem}
                            onClick={()=>setmenuOpen(false)}>
                                <LogIn className={navbarStyles.mobileMenuIcon} /> LogIn
                            </NavLink></li>
                        )}
                        </ul>
                    </div>
                )}
            {/* Menu ends here */}
                </div>


        </div>

        <style>
            {navbarStyles.animations}
        </style>
    </nav>
  )
}

export default Navbar
