"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  CalendarCheck,
  Heart,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ARTIST" | "CLIENT";
  avatarUrl?: string | null;
}

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check auth state on mount & route change
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.data?.user) {
            setUser(json.data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    checkAuth();
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artists?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getDashboardHref = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "ARTIST":
        return "/artist/dashboard";
      case "CLIENT":
      default:
        return "/client/bookings";
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Find Artists", href: "/artists" },
    { label: "Packages", href: "/packages" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 border-b border-black/[0.06] backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none" aria-label="GlamBook Home">
            {/* Elegant Floral / Monogram Emblem */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#eb7583] to-[#fcdadb] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-xs">
              <div className="w-full h-full bg-[#fcf1ef] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#eb7583]" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-[26px] font-medium tracking-wide text-[#1e1a19] leading-tight">
                GlamBook
              </span>
              <span className="text-[9.5px] tracking-[0.28em] uppercase text-[#eb7583] font-semibold leading-none mt-0.5">
                HAUTE BEAUTÉ &amp; ART
              </span>
            </div>
          </Link>

          {/* 2. Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-[#eb7583] font-semibold" : "text-[#554f4e] hover:text-[#1e1a19]"
                  }`}
                >
                  {link.label}
                  {/* Subtle active underline bar matching brand rose */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#eb7583] rounded-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Search Icon, Login, Sign Up / User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle Icon (Desktop / Tablet) */}
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-[#fcdadb] focus-within:border-[#eb7583] rounded-full pl-3.5 pr-1.5 py-1 z-20 shadow-xl w-60 sm:w-72 transition-all"
                >
                  <Search className="w-4 h-4 text-[#eb7583] shrink-0 mr-2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artist or service..."
                    className="w-full bg-transparent text-xs text-[#1e1a19] placeholder-neutral-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-neutral-400 hover:text-[#1e1a19] rounded-full transition-colors ml-1"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-[#554f4e] hover:text-[#eb7583] transition-colors rounded-full hover:bg-[#fcf1ef] min-h-[40px] min-w-[40px] flex items-center justify-center"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {loadingUser ? (
              <div className="w-20 h-9 rounded-full bg-neutral-100 animate-pulse hidden sm:block" />
            ) : user ? (
              /* User Profile Pill & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#fcf1ef] hover:bg-[#fcdadb]/70 border border-[#fcdadb] transition-colors shadow-2xs"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#eb7583]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#eb7583] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-semibold text-[#1e1a19] max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#eb7583]" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-black/[0.08] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.08)] py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-black/[0.06]">
                      <p className="text-xs font-semibold text-[#1e1a19] truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-semibold bg-[#fcf1ef] text-[#eb7583] border border-[#fcdadb]">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={getDashboardHref(user.role)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#554f4e] hover:text-[#eb7583] hover:bg-[#fcf1ef] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#eb7583]" />
                        <span>Dashboard</span>
                      </Link>

                      {user.role === "CLIENT" && (
                        <>
                          <Link
                            href="/client/bookings"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-[#554f4e] hover:text-[#eb7583] hover:bg-[#fcf1ef] transition-colors"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-[#eb7583]" />
                            <span>My Bookings</span>
                          </Link>
                          <Link
                            href="/client/favorites"
                            className="flex items-center gap-2 px-4 py-2 text-xs text-[#554f4e] hover:text-[#eb7583] hover:bg-[#fcf1ef] transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5 text-[#eb7583]" />
                            <span>Saved Artists</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-black/[0.06]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Public Auth Options: Login + Rose Gold Sign Up Pill (Desktop/Tablet) */
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-semibold text-[#1e1a19] hover:text-[#eb7583] px-3 py-2 transition-colors rounded-full hover:bg-[#fcf1ef]"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full bg-[#eb7583] hover:bg-[#d4616f] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-[0_4px_14px_rgba(235,117,131,0.25)] hover:shadow-[0_6px_20px_rgba(235,117,131,0.35)] active:scale-[0.98] min-h-[38px]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1e1a19] hover:text-[#eb7583] hover:bg-[#fcf1ef] transition-colors rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-black/[0.06] shadow-xl px-4 pt-4 pb-7 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#fcf1ef] border border-[#fcdadb] rounded-full px-3.5 py-2 w-full shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#eb7583] shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artist or service..."
              className="w-full bg-transparent text-xs text-[#1e1a19] placeholder-neutral-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-0.5 text-neutral-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between min-h-[44px] ${
                    isActive
                      ? "text-[#eb7583] bg-[#fcf1ef] font-semibold border border-[#fcdadb]"
                      : "text-[#3e3938] hover:text-[#1e1a19] hover:bg-neutral-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />}
                </Link>
              );
            })}
          </nav>

          {!user && (
            <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-full border border-black/10 text-[#1e1a19] text-sm font-semibold hover:bg-neutral-50 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-full bg-[#eb7583] hover:bg-[#d4616f] text-white text-sm font-semibold transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
