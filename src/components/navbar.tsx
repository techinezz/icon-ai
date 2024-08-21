'use client';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const routes = [
  { name: 'Message', href: '/message' },
  { name: 'Code', href: '/code' },
  { name: 'Image', href: '/image' },
  { name: 'Video', href: '/video' },
  { name: 'Music', href: '/music' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-5 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/dashboard" className="text-xl font-bold hover:text-red-500">Icon AI</a>
        <div className="hidden md:flex space-x-8">
          {routes.map((route) => (
            <Link
            href={route.href}
            key={route.href}
            >
              <div 
              className={cn("hover:text-red-500",
                pathname === route.href ? "font-bold text-red-500" : "text-gray-300"
              )}>{route.name}</div>
            </Link>
          ))}
        </div>
        <div className="hidden md:flex space-x-8">
            <UserButton />
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div> 
      </div>
      
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {() => (
          <div className="md:hidden fixed inset-0 bg-black flex flex-col justify-center items-center space-y-8">
            <button
              className="absolute top-4 right-4 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {routes.map((route) => (
            <Link
            href={route.href}
            key={route.href}
            >
              <div 
              className={cn("hover:text-red-500",
                pathname === route.href ? "bold text-red-500" : "text-white"
              )}
              >{route.name}</div>
            </Link>
          ))}
            <div className="flex space-x-4">
                <UserButton />
            </div>
          </div>

        )}
      </Transition>
    </nav>
  );
};

export default Navbar;
