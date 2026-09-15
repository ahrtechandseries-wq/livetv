'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';

/**
 * Shows once per browser tab (sessionStorage-gated) so it
 * doesn't replay on every client-side route change - only on
 * the very first load of a fresh session, per the spec's
 * "do not make it unnecessarily long" note.
 */
export default function Splash() {

  const [visible, setVisible] = useState(false);

  const [exiting, setExiting] = useState(false);

  useEffect(() => {

    const alreadyShown = window.sessionStorage.getItem('nexlive:splash-shown');

    if (alreadyShown) return;

    setVisible(true);

    const exitTimer = setTimeout(() => setExiting(true), 1400);

    const hideTimer = setTimeout(() => {

      setVisible(false);

      window.sessionStorage.setItem('nexlive:splash-shown', '1');

    }, 1800);

    return () => {

      clearTimeout(exitTimer);
      clearTimeout(hideTimer);

    };

  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nex-bg
        transition-opacity duration-400 ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="animate-nex-scale-in">
        <Logo size={72} animated />
      </div>

      <p className="mt-4 text-xs tracking-[0.3em] text-nex-muted uppercase animate-nex-fade-up">
        by AHR
      </p>

      <div className="mt-8 h-0.5 w-24 overflow-hidden rounded-full bg-nex-panel2">
        <div className="h-full w-1/2 animate-[nex-glow_1.1s_ease-in-out_infinite] bg-nex-red" />
      </div>
    </div>
  );

}
