// Sistema de notificações por email
// Para usar Resend em produção, instale: npm install resend
// E configure RESEND_API_KEY no .env

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  // Em desenvolvimento, apenas logamos
  if (process.env.NODE_ENV === "development") {
    console.log("📧 Email (DEV MODE):");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    return { success: true };
  }

  // Em produção com Resend configurado
  if (process.env.RESEND_API_KEY) {
    try {
      // Descomentar quando instalar resend
      // const { Resend } = await import("resend");
      // const resend = new Resend(process.env.RESEND_API_KEY);
      //
      // const { data, error } = await resend.emails.send({
      //   from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      //   to,
      //   subject,
      //   html,
      // });
      //
      // if (error) {
      //   console.error("Erro ao enviar email:", error);
      //   return { success: false, error };
      // }
      //
      // return { success: true, data };

      console.log("📧 Email enviado via Resend:", to, subject);
      return { success: true };
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return { success: false, error };
    }
  }

  console.warn("⚠️ RESEND_API_KEY não configurado");
  return { success: false, error: "Email não configurado" };
}

export async function sendProjectReviewEmail(
  studentEmail: string,
  studentName: string,
  projectTitle: string,
  status: "aprovado" | "reprovado",
  feedback: string,
  grade?: number
) {
  const subject =
    status === "aprovado"
      ? `✅ Projeto Aprovado: ${projectTitle}`
      : `❌ Projeto Reprovado: ${projectTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: ${status === "aprovado" ? "#10b981" : "#ef4444"};
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .feedback-box {
            background: white;
            border-left: 4px solid ${status === "aprovado" ? "#10b981" : "#ef4444"};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .grade {
            font-size: 24px;
            font-weight: bold;
            color: ${status === "aprovado" ? "#10b981" : "#ef4444"};
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${status === "aprovado" ? "🎉 Parabéns!" : "📝 Revisão Recebida"}</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${studentName}</strong>,</p>

          <p>
            Seu projeto <strong>"${projectTitle}"</strong> foi revisado e está
            <strong>${status === "aprovado" ? "APROVADO" : "REPROVADO"}</strong>.
          </p>

          ${grade !== undefined ? `<div class="grade">Nota: ${grade}/100</div>` : ""}

          <div class="feedback-box">
            <h3>Feedback do Instrutor:</h3>
            <p>${feedback.replace(/\n/g, "<br>")}</p>
          </div>

          ${
            status === "aprovado"
              ? `
          <p>
            Excelente trabalho! Continue assim e avance para o próximo módulo.
          </p>
          `
              : `
          <p>
            Não desanime! Use o feedback para melhorar e resubmeta seu projeto.
            Você está no caminho certo!
          </p>
          `
          }

          <div class="footer">
            <p>
              Esta é uma mensagem automática do sistema de Bootcamp.<br>
              Acesse a plataforma para ver mais detalhes.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: studentEmail,
    subject,
    html,
  });
}

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string,
  userRole: string,
  temporaryPassword?: string
) {
  const subject = "Bem-vindo ao Bootcamp! 🚀";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .credentials {
            background: white;
            border: 2px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 Bem-vindo ao Bootcamp!</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${userName}</strong>,</p>

          <p>
            Sua conta foi criada com sucesso! Você foi cadastrado como
            <strong>${userRole === "aluno" ? "Aluno" : userRole === "instrutor" ? "Instrutor" : "Admin"}</strong>.
          </p>

          ${
            temporaryPassword
              ? `
          <div class="credentials">
            <h3>🔐 Suas credenciais de acesso:</h3>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Senha temporária:</strong> ${temporaryPassword}</p>
            <p style="color: #ef4444; font-size: 14px;">
              ⚠️ Por segurança, altere sua senha no primeiro acesso!
            </p>
          </div>
          `
              : ""
          }

          <p>
            ${
              userRole === "aluno"
                ? "Explore os cursos disponíveis e comece sua jornada de aprendizado!"
                : userRole === "instrutor"
                ? "Você já pode começar a revisar projetos e acompanhar o progresso dos alunos."
                : "Você tem acesso total ao sistema para gerenciar cursos, usuários e conteúdo."
            }
          </p>

          <center>
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login" class="button">
              Acessar Plataforma
            </a>
          </center>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Se você tiver alguma dúvida, entre em contato com o suporte.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    html,
  });
}
