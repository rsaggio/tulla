"use client";

import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import ReactMarkdown from "react-markdown";
import ConversationsSidebar from "@/components/chat/ConversationsSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface FullConversation {
  _id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export default function AssistenteVirtualPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar lista de conversas
  useEffect(() => {
    async function init() {
      await loadConversations();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selecionar primeira conversa automaticamente quando houver conversas mas nenhuma selecionada
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0 && !loadingConversations) {
      loadConversation(conversations[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, currentConversationId, loadingConversations]);

  async function loadConversations() {
    try {
      setLoadingConversations(true);
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadConversation(id: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data: FullConversation = await res.json();
        setCurrentConversationId(data._id);
        setMessages(
          data.messages.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao carregar conversa:", error);
    }
  }

  async function handleNewConversation() {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nova Conversa" }),
      });

      if (res.ok) {
        const newConversation: FullConversation = await res.json();
        await loadConversations();
        loadConversation(newConversation._id);
      }
    } catch (error) {
      console.error("Erro ao criar nova conversa:", error);
    }
  }

  async function handleDeleteConversation(id: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Se deletou a conversa atual, limpar
        if (currentConversationId === id) {
          setCurrentConversationId(null);
          setMessages([]);
        }
        await loadConversations();
      }
    } catch (error) {
      console.error("Erro ao deletar conversa:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || !currentConversationId) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: input,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Atualizar lista de conversas
      await loadConversations();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ height: { xs: "calc(100vh - 120px)", md: "calc(100vh - 100px)" }, display: "flex" }}>
      {/* Sidebar com conversas */}
      <ConversationsSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={loadConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Área principal do chat */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            {/* Hamburger menu for mobile */}
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "primary.contrastText",
                p: 0.5,
              }}
            >
              <MenuIcon />
            </IconButton>
            <SmartToyIcon sx={{ fontSize: { xs: 28, sm: 36, md: 40 } }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.75rem' } }}>
                Tulla - Assistente Virtual
              </Typography>
              <Typography sx={{ opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}>
                Sua parceira de estudos em programação, disponível 24/7
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Área de mensagens */}
        <Paper
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 0,
          }}
        >
          {!currentConversationId ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <SmartToyIcon sx={{ fontSize: { xs: 48, md: 64 }, color: "text.disabled" }} />
              <Typography sx={{ color: "text.secondary", textAlign: "center", fontSize: { xs: '0.85rem', sm: '1rem', md: '1.15rem' } }}>
                Selecione uma conversa ou crie uma nova
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  mb: 2,
                  pr: { xs: 0, sm: 1 },
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: "grey.100",
                    borderRadius: 1,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "grey.400",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "grey.500",
                    },
                  },
                }}
              >
                <Stack spacing={{ xs: 2, sm: 3 }}>
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: { xs: 1, sm: 2 },
                        alignItems: "flex-start",
                        flexDirection: message.role === "user" ? "row-reverse" : "row",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: message.role === "assistant" ? "primary.main" : "secondary.main",
                          width: { xs: 32, sm: 40 },
                          height: { xs: 32, sm: 40 },
                          flexShrink: 0,
                        }}
                      >
                        {message.role === "assistant" ? (
                          <SmartToyIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        ) : (
                          <PersonIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        )}
                      </Avatar>
                      <Paper
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          maxWidth: { xs: "85%", sm: "75%", md: "70%" },
                          bgcolor: message.role === "assistant" ? "grey.100" : "primary.main",
                          color:
                            message.role === "assistant" ? "text.primary" : "primary.contrastText",
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            "& p": { m: 0, mb: 1, "&:last-child": { mb: 0 }, fontSize: { xs: '0.85rem', sm: '0.925rem', md: '1rem' } },
                            "& pre": {
                              bgcolor: message.role === "assistant" ? "grey.800" : "rgba(0,0,0,0.2)",
                              color:
                                message.role === "assistant" ? "grey.100" : "primary.contrastText",
                              p: { xs: 1, sm: 2 },
                              borderRadius: 1,
                              overflowX: "auto",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            },
                            "& code": {
                              bgcolor: message.role === "assistant" ? "grey.800" : "rgba(0,0,0,0.2)",
                              color:
                                message.role === "assistant" ? "grey.100" : "primary.contrastText",
                              p: 0.5,
                              borderRadius: 0.5,
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            },
                            "& ul, & ol": { ml: 2, mb: 1 },
                            "& li": { mb: 0.5, fontSize: { xs: '0.85rem', sm: '0.925rem', md: '1rem' } },
                          }}
                        >
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 1,
                            opacity: 0.7,
                            textAlign: message.role === "user" ? "right" : "left",
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                          }}
                        >
                          {message.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  {loading && (
                    <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "primary.main", width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                        <SmartToyIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                      </Avatar>
                      <Paper sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: "grey.100" }}>
                        <Typography sx={{ color: "text.secondary", fontStyle: "italic", fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Tulla está digitando...
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Stack>
              </Box>

              {/* Input de mensagem */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  gap: 1,
                  pt: { xs: 1, sm: 2 },
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Digite sua dúvida..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: { xs: '0.85rem', sm: '1rem' },
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={!input.trim() || loading}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    width: { xs: 44, sm: 56 },
                    height: { xs: 44, sm: 56 },
                    flexShrink: 0,
                    "&:hover": { bgcolor: "primary.dark" },
                    "&:disabled": { bgcolor: "action.disabledBackground" },
                  }}
                >
                  <SendIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
