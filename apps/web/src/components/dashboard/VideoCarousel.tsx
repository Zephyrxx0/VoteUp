"use client";

import { useEffect } from "react";
import { Play, ExternalLink } from "lucide-react";
import { usePipelineStore } from "@/store/pipelineStore";
import { useVideos } from "@/hooks/useVideos";

export function VideoCarousel() {
  const { fetchVideos } = useVideos();
  const videos = usePipelineStore((state) => state.videos);
  const activeStage = usePipelineStore((state) => state.activeStage);

  useEffect(() => {
    if (activeStage?.stageId) {
      void fetchVideos();
    }
  }, [activeStage?.stageId, fetchVideos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Learn More</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Educational videos about this election stage.
      </p>

      <div className="mt-4 snap-scroll-x flex gap-4 pb-2">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-shrink-0 w-64 rounded-xl overflow-hidden border bg-muted transition-all hover:shadow-lg hover:border-primary/30"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full bg-civic-dark/5">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-white/90 p-3 shadow-lg">
                  <Play className="h-5 w-5 text-civic-indigo fill-current" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="p-3">
              <h3 className="text-xs font-medium leading-snug text-foreground line-clamp-2">
                {video.title}
              </h3>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                YouTube
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
