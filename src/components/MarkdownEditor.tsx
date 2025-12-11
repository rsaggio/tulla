"use client";

import { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  name?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  label = "Conteúdo (Markdown)",
  placeholder = "Escreva o conteúdo em Markdown...",
  required = false,
  rows = 20,
  name,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Sincronizar scroll do preview com a posição do cursor no editor
  const handleScroll = () => {
    if (textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      const preview = previewRef.current;

      // Calcular a porcentagem de scroll do textarea
      const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);

      // Aplicar a mesma porcentagem no preview
      if (isFinite(scrollPercentage)) {
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
      }
    }
  };

  // Sincronizar scroll quando o cursor se move
  const handleCursorChange = () => {
    if (textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      const preview = previewRef.current;

      const cursorPosition = textarea.selectionStart;
      const totalLength = textarea.value.length;

      if (totalLength > 0) {
        const scrollPercentage = cursorPosition / totalLength;
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
      }
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      textarea.addEventListener('click', handleCursorChange);
      textarea.addEventListener('keyup', handleCursorChange);

      return () => {
        textarea.removeEventListener('scroll', handleScroll);
        textarea.removeEventListener('click', handleCursorChange);
        textarea.removeEventListener('keyup', handleCursorChange);
      };
    }
  }, []);

  const markdownComponents = {
    h1: ({ children }: any) => (
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        {children}
      </Typography>
    ),
    h2: ({ children }: any) => (
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        {children}
      </Typography>
    ),
    h3: ({ children }: any) => (
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
        {children}
      </Typography>
    ),
    h4: ({ children }: any) => (
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
        {children}
      </Typography>
    ),
    p: ({ children }: any) => (
      <Typography variant="body1" paragraph>
        {children}
      </Typography>
    ),
    ul: ({ children }: any) => (
      <Box component="ul" sx={{ pl: 3, my: 1 }}>
        {children}
      </Box>
    ),
    ol: ({ children }: any) => (
      <Box component="ol" sx={{ pl: 3, my: 1 }}>
        {children}
      </Box>
    ),
    li: ({ children }: any) => (
      <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
        {children}
      </Typography>
    ),
    code: ({ inline, children, ...props }: any) =>
      inline ? (
        <Box
          component="code"
          sx={{
            bgcolor: "action.hover",
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            fontFamily: "monospace",
            fontSize: "0.875em",
          }}
          {...props}
        >
          {children}
        </Box>
      ) : (
        <Box
          component="pre"
          sx={{
            bgcolor: "action.hover",
            p: 2,
            borderRadius: 1,
            overflow: "auto",
            my: 2,
          }}
        >
          <Box
            component="code"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
            {...props}
          >
            {children}
          </Box>
        </Box>
      ),
    blockquote: ({ children }: any) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: "4px solid",
          borderColor: "primary.main",
          pl: 2,
          py: 0.5,
          my: 2,
          fontStyle: "italic",
          color: "text.secondary",
        }}
      >
        {children}
      </Box>
    ),
    a: ({ children, href }: any) => (
      <Box
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: "primary.main",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {children}
      </Box>
    ),
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
        {label}
        {required && <span style={{ color: "error.main" }}> *</span>}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
            Editor
          </Typography>
          <TextField
            fullWidth
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            multiline
            rows={rows}
            inputRef={textareaRef}
            sx={{
              "& textarea": {
                fontFamily: "monospace",
                fontSize: "0.875rem",
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Preview
            </Typography>
            <IconButton
              size="small"
              onClick={() => setFullscreenOpen(true)}
              sx={{ ml: 1 }}
            >
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Box>
          <Paper
            ref={previewRef}
            variant="outlined"
            sx={{
              p: 3,
              minHeight: rows * 24,
              maxHeight: rows * 24,
              overflow: "auto",
              bgcolor: "background.default",
            }}
          >
            {value ? (
              <ReactMarkdown components={markdownComponents}>
                {value}
              </ReactMarkdown>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum conteúdo para visualizar
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
        Use Markdown para formatar o conteúdo. Suporta código, listas, links, etc.
      </Typography>

      {/* Dialog Fullscreen */}
      <Dialog
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Preview em Tela Cheia
          <IconButton onClick={() => setFullscreenOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflow: "auto" }}>
          {value ? (
            <ReactMarkdown components={markdownComponents}>
              {value}
            </ReactMarkdown>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nenhum conteúdo para visualizar
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
