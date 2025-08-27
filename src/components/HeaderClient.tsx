'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { userLogOutService } from "@/services/logoutServices";
import { toastError, toastLite } from "@/utils/toast";

type HeaderClientProps = {
  isLoggedIn: boolean;
};

export default function HeaderClient({ isLoggedIn }: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await userLogOutService();
      toastLite("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toastError("Failed to logout");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Login</Link>
        <Link href="/auth/register" className="text-sm text-gray-600 hover:text-gray-700">Register</Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 border rounded"
        onClick={() => setOpen(p => !p)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Account ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white border rounded shadow-md py-1 z-50">
          <Link href="/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Profile</Link>
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

