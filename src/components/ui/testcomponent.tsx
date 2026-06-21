/* 
 * Scaffolded with @ui-factory/cli
 * Created by Alex Perez Cedeno (@alexcodeui)
 * Premium, dynamic components for the AI era.
 */
"use client";

import React from "react";

export const Testcomponent = ({ className }: { className?: string }) => {
  return (
    <div className={`relative p-4 bg-zinc-950 dark:bg-white text-white dark:text-black border border-white/10 dark:border-black/10 rounded-xl ${className || ""}`}>
      <p className="font-bold uppercase tracking-widest">TestComponent</p>
    </div>
  );
};
