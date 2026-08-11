import React, { useState, useEffect, useRef } from 'react'
import { Container, Logo } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  // useEffect(() => {
  //   console.log("Header rendered, userData:", userData)
  // }, [userData])

  // Reset dropdown and mobile menu state when auth status changes
  useEffect(() => {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }, [authStatus, userData])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [dropdownOpen])

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus },
  ]

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout())
      navigate('/')
    })
    setMobileMenuOpen(false)
  }

  const handleNavigation = (slug) => {
    navigate(slug)
    setMobileMenuOpen(false)
  }

  return (
    <header className="pt-3 pb-2 px-2 md:px-4 shadow-lg shadow-blue-100/60">
      <Container className="rounded-xl">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <Logo width="50px" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex ml-auto items-center gap-2">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-4 py-2 duration-200 rounded-full transition-all ${
                      location.pathname === item.slug
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-300 ring-opacity-50 transform scale-105'
                        : 'hover:bg-blue-100 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {authStatus && userData && (
              <li className="relative" ref={dropdownRef}>
                <button
                  key={userData?.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDropdownOpen(!dropdownOpen)
                  }}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-colors"
                >
                  {userData.name?.charAt(0).toUpperCase() || 'U'}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <div className="p-3 border-b">
                      <div className="font-semibold truncate">{userData.name}</div>
                      <div className="text-sm text-gray-600 truncate">{userData.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* User Avatar for Mobile */}
            {authStatus && userData && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDropdownOpen(!dropdownOpen)
                  }}
                  className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-colors"
                >
                  {userData.name?.charAt(0).toUpperCase() || 'U'}
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-xl z-[100]">
                    <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                      <div className="font-semibold text-gray-900 truncate text-sm">{userData.name}</div>
                      <div className="text-xs text-gray-600 truncate">{userData.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard')
                        setDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 font-medium text-sm"
                    >
                      📊 Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium border-t text-sm rounded-b-lg transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t pt-3">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.slug)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        location.pathname === item.slug
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                          : 'hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header
