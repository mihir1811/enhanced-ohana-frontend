"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState, CSSProperties, MouseEvent } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface ReusableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  variant?: "default" | "underline" | "pills";
  size?: "sm" | "md" | "lg";
}

type TabButtonProps = {
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
  className: string;
};

function TabButton({
  label,
  isActive,
  disabled,
  onClick,
  className,
}: TabButtonProps) {
  const [rippleStyle, setRippleStyle] = useState<CSSProperties>({});
  const [rippleKey, setRippleKey] = useState(0);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || isActive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    setRippleStyle({
      width: size,
      height: size,
      left: x,
      top: y,
    });
    setRippleKey(Date.now());
    setShowRipple(true);

    setTimeout(() => {
      setShowRipple(false);
    }, 400);

    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn("relative overflow-hidden", className)}
    >
      {showRipple && (
        <span
          key={rippleKey}
          style={rippleStyle}
          className="pointer-events-none absolute z-10 rounded-full bg-blue-500/40 opacity-75 animate-ping"
        />
      )}
      {label}
    </button>
  );
}

export function ReusableTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabsClassName,
  contentClassName,
  variant = "default",
  size = "md",
}: ReusableTabsProps) {

  const getTabStyles = (tabId: string, isActive: boolean) => {
    const baseStyles = "font-medium transition-all cursor-pointer";
    
    switch (variant) {
      case "underline":
        return cn(
          baseStyles,
          "pb-4 px-4 border-b-2",
          size === "sm" ? "text-sm py-2" : size === "lg" ? "text-lg py-6" : "text-base py-4",
          isActive
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
        );
      
      case "pills":
        return cn(
          baseStyles,
          "rounded-lg px-4 py-2",
          size === "sm" ? "text-sm px-3 py-1" : size === "lg" ? "text-lg px-6 py-3" : "text-base px-4 py-2",
          isActive
            ? "bg-blue-500 text-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        );
      
      default:
        return cn(
          baseStyles,
          "px-4 py-2 rounded-md",
          size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
          isActive
            ? "bg-blue-500 text-white"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        );
    }
  };

  const getTabsContainerStyles = () => {
    switch (variant) {
      case "underline":
        return "flex gap-4 border-b border-border bg-white";
      case "pills":
        return "flex gap-2 p-1 bg-muted rounded-lg";
      default:
        return "flex gap-2 bg-white";
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn("space-y-6", className)}>
      <div className={cn(getTabsContainerStyles(), tabsClassName)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={isActive}
              disabled={tab.disabled || isActive}
              onClick={() => onTabChange(tab.id)}
              className={getTabStyles(tab.id, isActive)}
            />
          );
        })}
      </div>
      
      <div className={cn("w-full", contentClassName)}>
        {activeTabContent}
      </div>
    </div>
  );
}
