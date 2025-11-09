import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  const navLinks = [
    { href: '/#home', label: 'Home' },
    { href: '/#about', label: 'About Us' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#impact', label: 'Our Impact' },
    { href: '/#get-involved', label: 'Get Involved' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card/95 backdrop-blur-md shadow-lg' : 'bg-card/50 backdrop-blur-sm'}`}>
      <nav className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group" onClick={closeMenu}>
            <img 
              src="https://i.ibb.co/zhCPpPL8/Chat-GPT-Image-Oct-7-2025-08-01-14-PM-removebg-preview.png" 
              alt="Community Fridge Logo" 
              className="h-16 sm:h-20 md:h-24 transition-transform group-hover:scale-110"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Community Fridge</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10 h-12 w-12"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-7 w-7" /> : <Moon className="h-7 w-7" />}
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 h-12 w-12"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[380px] sm:w-[420px]">
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="py-3 px-4 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                        onClick={closeMenu}
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                  
                  <div className="border-t border-border pt-4">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline" onClick={closeMenu} className="w-full">
                          <Link to="/profile">My Profile</Link>
                        </Button>
                        <Button 
                          onClick={async () => { 
                            closeMenu(); 
                            await signOut(); 
                          }} 
                          variant="secondary" 
                          className="w-full"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline" onClick={closeMenu} className="w-full">
                          <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild variant="default" onClick={closeMenu} className="w-full">
                          <Link to="/signup">Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};
