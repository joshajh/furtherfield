type VimeoEmbedProps = {
  videoId: string;
  className?: string;
};

export function VimeoEmbed({ videoId, className = "" }: VimeoEmbedProps) {
  return (
    <div className={`relative h-[300px] md:h-[450px] rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Felixstowe Port"
      />
    </div>
  );
}
