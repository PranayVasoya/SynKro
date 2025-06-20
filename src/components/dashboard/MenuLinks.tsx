"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Sun, Moon, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export interface MenuItemDefinition {
  label: string;
  icon: React.ReactNode;
  action: (e: React.MouseEvent) => void;
  testid?: string;
}

interface MenuLinksProps {
  menuItems: MenuItemDefinition[];
  settingsRef: React.RefObject<HTMLDivElement | null>;
  showSettingsDropdown: boolean;
  theme?: string;
  toggleTheme: () => void;
  router: AppRouterInstance;
  setShowSettingsDropdown: (
    value: boolean | ((prev: boolean) => boolean)
  ) => void;
  setShowSidebar: (value: boolean) => void;
}

export default function MenuLinks({
  menuItems,
  settingsRef,
  showSettingsDropdown,
  theme,
  toggleTheme,
  router,
  setShowSettingsDropdown,
  setShowSidebar,
}: MenuLinksProps) {
  return (
    <motion.div
      className="flex flex-col space-y-1 w-full"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
      }}
      initial="hidden"
      animate="visible"
    >
      {menuItems.map((item, idx) => (
        <div
          key={item.label || idx}
          className="relative"
          ref={item.label === "Settings" ? settingsRef : null}
        >
          <motion.button
            type="button"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex items-center text-foreground cursor-pointer px-3 py-2 hover:bg-muted rounded-md transition-colors duration-200 w-full text-left"
            onClick={(e) => {
              item.action(e);
            }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            data-testid={item.testid || `menu-${item.label.toLowerCase()}`}
          >
            {item.icon}
            <span className="ml-3 font-medium text-sm">{item.label}</span>
          </motion.button>
          <AnimatePresence>
            {item.label === "Settings" && showSettingsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1 w-48 bg-popover shadow-lg rounded-md border border-border z-[120] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setShowSettingsDropdown(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  data-testid="menu-theme-toggle"
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4 mr-2" />
                  ) : (
                    <Sun className="w-4 h-4 mr-2" />
                  )}{" "}
                  Toggle Theme
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      router.push("/faq");
                      setShowSettingsDropdown(false);
                      setShowSidebar(false);
                    } catch (_err) {
                      console.error("Nav to /faq failed", _err);
                      toast.error("FAQ page not found.");
                    }
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  data-testid="menu-faq"
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> FAQ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
}
