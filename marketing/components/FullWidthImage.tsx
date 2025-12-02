import Image from "next/image";

type FullWidthImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function FullWidthImage({ src, alt, className = "" }: FullWidthImageProps) {
  return (
    <div className={`relative h-[500px] md:h-[700px] rounded-lg overflow-hidden mx-2.5 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}
