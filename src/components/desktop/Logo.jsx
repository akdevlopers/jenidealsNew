"use client";

import Image from "next/image";
import logoImg from "../../assets/logo.png";

export function LogoMark({
  size = 64,
  rounded = 18,
  badge,
  stroke,
  showBadge = true,
}) {
  return (
    <div 
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Image
        src={logoImg}
        alt="Jeni Deals"
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        priority
      />
    </div>
  );
}

export function Wordmark({
  size = 34,
  first = "var(--navy)",
  second = "var(--orange)",
}) {
  return (
    <span
      className="font-display font-extrabold tracking-tight"
      style={{ fontSize: size, lineHeight: 1 }}
    >
      <span style={{ color: first }}>Jeni</span>
      <span style={{ color: second }}>deals</span>
    </span>
  );
}

export function LogoLockup({
  markSize = 48,
  wordSize = 30,
  gap = 14,
  badge,
  stroke,
  first,
  second,
  stacked = false,
}) {
  return (
    <div
      className={stacked ? "flex flex-col items-center" : "flex items-center"}
      style={{ gap }}
    >
      <LogoMark size={markSize} badge={badge} stroke={stroke} />
      <Wordmark size={wordSize} first={first} second={second} />
    </div>
  );
}
