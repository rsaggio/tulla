"use client";

import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { PlayCircle } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import VimeoPlayer from "@/components/VimeoPlayer";

interface VideoLessonProps {
  title: string;
  videoUrl: string;
  content?: string;
  duration?: number;
  resources?: { title: string; url: string }[];
}

export default function VideoLesson({
  title,
  videoUrl,
  content,
  duration,
  resources,
}: VideoLessonProps) {
  const isVimeo = /vimeo\.com/.test(videoUrl);
  const isYouTube = /youtu\.?be/.test(videoUrl);

  const getYouTubeEmbedUrl = (url: string) => {
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }
    return url;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            icon={<PlayCircle />}
            label="Vídeo"
            color="primary"
            size="small"
          />
          {duration && (
            <Typography variant="body2" color="text.secondary">
              {duration} minutos
            </Typography>
          )}
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
      </Box>

      {/* Video Player */}
      {isVimeo ? (
        <Box sx={{ mb: 4 }}>
          <VimeoPlayer videoUrl={videoUrl} title={title} />
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            position: "relative",
            paddingTop: "56.25%",
            mb: 4,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            src={isYouTube ? getYouTubeEmbedUrl(videoUrl) : videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Paper>
      )}

      {/* Content */}
      {content && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sobre esta aula
          </Typography>
          <Box
            sx={{
              "& p": { mb: 2 },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                fontWeight: "bold",
                mt: 2,
                mb: 1,
              },
              "& ul, & ol": { pl: 3, mb: 2 },
              "& code": {
                bgcolor: "grey.100",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.9em",
              },
              "& pre": {
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                mb: 2,
              },
            }}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
        </Paper>
      )}

      {/* Resources */}
      {resources && resources.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recursos Adicionais
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            {resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
