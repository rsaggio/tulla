"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const SIDEBAR_WIDTH = 280;

interface Conversation {
  _id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
}

interface ConversationsSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function ConversationsSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  mobileOpen = false,
  onMobileClose,
}: ConversationsSidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Tem certeza que deseja deletar esta conversa?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await onDeleteConversation(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    onMobileClose?.();
  };

  const handleNew = () => {
    onNewConversation();
    onMobileClose?.();
  };

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNew}
          sx={{ mb: 1 }}
        >
          Nova Conversa
        </Button>
        <Typography variant="caption" color="text.secondary">
          {conversations.length} {conversations.length === 1 ? "conversa" : "conversas"}
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", p: 1 }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma conversa ainda.
              <br />
              Clique em &quot;Nova Conversa&quot; para começar!
            </Typography>
          </Box>
        ) : (
          conversations.map((conv) => (
            <ListItem
              key={conv._id}
              disablePadding
              sx={{ mb: 0.5 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => handleDelete(e, conv._id)}
                  disabled={deletingId === conv._id}
                  sx={{
                    opacity: 0,
                    transition: "opacity 0.2s",
                    ".MuiListItem-root:hover &": {
                      opacity: 1,
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                selected={currentConversationId === conv._id}
                onClick={() => handleSelect(conv._id)}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "grey.200",
                    "&:hover": {
                      bgcolor: "grey.300",
                    },
                  },
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <ListItemText
                  primary={conv.title}
                  secondary={
                    <>
                      {conv.lastMessage && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "grey.700",
                          }}
                        >
                          {conv.lastMessage}
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          fontSize: "0.7rem",
                          color: "grey.600",
                        }}
                      >
                        {formatDistanceToNow(new Date(conv.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: currentConversationId === conv._id ? 600 : 400,
                    noWrap: true,
                    color: "grey.900",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          height: "100%",
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
}
