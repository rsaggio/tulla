"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface VimeoPlayerProps {
  videoUrl: string;
  title?: string;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export default function VimeoPlayer({ videoUrl, title }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const vimeoId = extractVimeoId(videoUrl);

  const initPlayer = useCallback(async () => {
    if (!containerRef.current || !vimeoId || playerRef.current) return;

    // Dynamic import to avoid SSR issues
    const Plyr = (await import("plyr")).default;

    // Import Plyr CSS
    if (!document.querySelector('link[href*="plyr"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
      document.head.appendChild(link);
    }

    // Create the Plyr-compatible div
    const wrapper = document.createElement("div");
    wrapper.setAttribute(
      "data-plyr-provider",
      "vimeo"
    );
    wrapper.setAttribute("data-plyr-embed-id", vimeoId);
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(wrapper);

    playerRef.current = new Plyr(wrapper, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 2],
      },
      tooltips: { controls: true, seek: true },
      keyboard: { focused: true, global: false },
      i18n: {
        restart: "Reiniciar",
        play: "Reproduzir",
        pause: "Pausar",
        fastForward: "Avançar {seektime}s",
        rewind: "Retroceder {seektime}s",
        seek: "Buscar",
        seekLabel: "{currentTime} de {duration}",
        played: "Reproduzido",
        buffered: "Carregado",
        currentTime: "Tempo atual",
        duration: "Duração",
        volume: "Volume",
        mute: "Mudo",
        unmute: "Ativar som",
        enableCaptions: "Ativar legendas",
        disableCaptions: "Desativar legendas",
        enterFullscreen: "Tela cheia",
        exitFullscreen: "Sair da tela cheia",
        frameTitle: "Player para {title}",
        captions: "Legendas",
        settings: "Configurações",
        menuBack: "Voltar",
        speed: "Velocidade",
        normal: "Normal",
        quality: "Qualidade",
        loop: "Repetir",
        start: "Início",
        end: "Fim",
        all: "Todos",
        reset: "Resetar",
        disabled: "Desativado",
        enabled: "Ativado",
      },
    });
  }, [vimeoId]);

  useEffect(() => {
    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initPlayer]);

  if (!vimeoId) {
    return (
      <Box sx={{ p: 4, textAlign: "center", bgcolor: "#000", borderRadius: 2 }}>
        <Typography color="error">URL de vídeo inválida</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        // Plyr theme customization
        "--plyr-color-main": "#1976d2",
        "--plyr-video-background": "#000",
        "--plyr-badge-background": "#1976d2",
        "--plyr-badge-text-color": "#fff",
        "--plyr-badge-border-radius": "3px",
        "--plyr-control-radius": "4px",
        "& .plyr": {
          borderRadius: "inherit",
        },
        "& .plyr--full-ui input[type=range]": {
          color: "var(--plyr-color-main)",
        },
      }}
    >
      <div ref={containerRef} />
    </Box>
  );
}
