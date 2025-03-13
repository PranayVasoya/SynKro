"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

const Navbar = () => {
    const pathname = usePathname();
        return (
            <div className='flex flex-col items-center w-full overflow-hidden'>
                <div className="flex justify-center items-center w-full h-[10vh] bg-white border-b-2 border-black">
                    <div className="flex justify-between items-center w-full max-w-7xl px-4">
                        <div className="flex items-center space-x-2">
                            <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="black"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <Link href="/" className="text-black text-2xl md:text-3xl font-semibold">
                                SynKro
                            </Link>
                        </div>
                            {/* Sign In Button (Hidden on /signin page) */}
                            {pathname !== "/signin" && (
                                <Link href="/signin" className="text-black text-sm md:text-lg font-semibold border-2 border-black px-3 py-2 rounded-full">
                                    Sign In
                                </Link>
                            )}
                    </div>
                </div>
            </div>
        )
}
export default Navbar
