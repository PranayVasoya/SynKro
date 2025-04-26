"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    return (
        <div className="flex flex-col items-center w-full overflow-hidden">
            <div className="flex justify-center items-center w-full h-[10vh] bg-gradient-to-r from-blue-50 to-blue-100 dark:from-card dark:to-muted shadow-md">
                <div className="flex justify-between items-center w-full max-w-7xl px-4">
                    <div className="flex items-center">
                        <Link href="/" className="text-foreground text-2xl md:text-3xl font-semibold">
                            SynKro
                        </Link>
                    </div>
                    {/* Sign In Button (Hidden on /signin page) */}
                    {pathname !== "/signin" && (
                        <Link href="/signin" className="text-foreground text-sm md:text-lg font-semibold border border-border px-4 py-2 rounded-full hover:bg-blue-200 dark:hover:bg-gray-700 transition-all duration-300">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;