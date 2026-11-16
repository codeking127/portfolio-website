"use client";
import Image from "next/image";
import { useDesktop, type PhotoInfo } from "./desktop-context";

type Props = PhotoInfo & {
  sizes?: string;
  className?: string;
  /** open a different (larger) photo than the one shown, e.g. the avatar */
  zoomTo?: PhotoInfo;
};

/** A photo that opens in its own window, unfolding like paper, when tapped. */
export default function Photo({ src, alt, cap, w, h, sizes = "240px", className = "", zoomTo }: Props) {
  const { openPhoto } = useDesktop();
  const show = () => openPhoto(zoomTo ?? { src, alt, cap, w, h });
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      className={`zoom ${className}`}
      role="button"
      tabIndex={0}
      onClick={show}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show();
        }
      }}
    />
  );
}
