type VimeoEmbedProps = {
  videoId: string;
  className?: string;
  fullViewport?: boolean;
};

export function VimeoEmbed({ videoId, className = "", fullViewport = false }: VimeoEmbedProps) {
  const heightClass = fullViewport
    ? "h-[70vh] md:h-[85vh]"
    : "h-[300px] md:h-[450px]";

  return (
    <div className={`relative ${heightClass} rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&byline=0&title=0&muted=1`}
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        allow="autoplay; fullscreen; picture-in-picture"
        title="Felixstowe Port"
      />
    </div>
  );
}
