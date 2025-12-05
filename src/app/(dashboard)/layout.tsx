import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/shared/DashboardNav";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <DashboardNav user={session.user} />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 4,
          bgcolor: "grey.50",
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
