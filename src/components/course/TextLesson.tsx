"use client";

import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { Article } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

interface TextLessonProps {
  title: string;
  content: string;
  type: "teoria" | "leitura";
  duration?: number;
  resources?: { title: string; url: string }[];
}

export default function TextLesson({
  title,
  content,
  type,
  duration,
  resources,
}: TextLessonProps) {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            icon={<Article />}
            label={type === "leitura" ? "Leitura" : "Teoria"}
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

      {/* Content */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box
          sx={{
            "& p": {
              mb: 2,
              lineHeight: 1.8,
              fontSize: "1.05rem",
            },
            "& h1": {
              fontSize: "2rem",
              fontWeight: "bold",
              mt: 4,
              mb: 2,
            },
            "& h2": {
              fontSize: "1.75rem",
              fontWeight: "bold",
              mt: 3,
              mb: 2,
            },
            "& h3": {
              fontSize: "1.5rem",
              fontWeight: "bold",
              mt: 2,
              mb: 1.5,
            },
            "& h4, & h5, & h6": {
              fontWeight: "bold",
              mt: 2,
              mb: 1,
            },
            "& ul, & ol": {
              pl: 3,
              mb: 2,
              "& li": {
                mb: 1,
                lineHeight: 1.8,
              },
            },
            "& blockquote": {
              borderLeft: 4,
              borderColor: "primary.main",
              pl: 2,
              py: 1,
              my: 2,
              bgcolor: "grey.50",
              fontStyle: "italic",
            },
            "& code": {
              bgcolor: "grey.100",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.9em",
              color: "error.main",
            },
            "& pre": {
              bgcolor: "grey.900",
              color: "grey.100",
              p: 2,
              borderRadius: 2,
              overflow: "auto",
              mb: 2,
              "& code": {
                bgcolor: "transparent",
                color: "inherit",
                p: 0,
              },
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 2,
              my: 2,
            },
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              my: 2,
              "& th, & td": {
                border: 1,
                borderColor: "divider",
                p: 1.5,
                textAlign: "left",
              },
              "& th": {
                bgcolor: "grey.100",
                fontWeight: "bold",
              },
            },
          }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Paper>

      {/* Resources */}
      {resources && resources.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recursos Adicionais
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            {resources.map((resource, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                  }}
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
