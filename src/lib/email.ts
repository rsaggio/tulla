// Sistema de notificações por email
// Para usar Resend em produção, instale: npm install resend
// E configure RESEND_API_KEY no .env

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  // Enviar via Resend quando a API key estiver configurada
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to,
        subject,
        html,
      });

      if (error) {
        console.error("Erro ao enviar email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return { success: false, error };
    }
  }

  // Sem Resend configurado, apenas loga no console (dev fallback)
  console.log("📧 Email (SEM RESEND_API_KEY - apenas log):");
  console.log("To:", to);
  console.log("Subject:", subject);
  return { success: false, error: "RESEND_API_KEY não configurado" };
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
  const platformUrl = "https://ead.tullabr.com";
  const firstName = userName.split(" ")[0];
  const subject = `${firstName}, sua jornada no Bootcamp Tulla começa agora! 🚀`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.7;
            color: #2d3748;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background: #f7fafc;
          }
          .header {
            background: linear-gradient(135deg, #4263eb 0%, #10b981 100%);
            color: white;
            padding: 40px 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 8px 0;
            font-size: 26px;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 15px;
          }
          .content {
            background: white;
            padding: 35px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .credentials {
            background: #f0f4ff;
            border-left: 4px solid #4263eb;
            padding: 20px 24px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
          }
          .credentials h3 {
            margin: 0 0 12px 0;
            color: #4263eb;
            font-size: 16px;
          }
          .credentials p {
            margin: 6px 0;
            font-size: 15px;
          }
          .credentials .password-value {
            font-family: 'Courier New', monospace;
            background: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #4263eb 0%, #3b82f6 100%);
            color: white !important;
            padding: 14px 36px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            margin: 8px 0;
          }
          .steps {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px 24px;
            margin: 24px 0;
          }
          .steps h3 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #374151;
          }
          .steps ol {
            margin: 0;
            padding-left: 20px;
          }
          .steps li {
            margin: 8px 0;
            font-size: 14px;
            color: #4b5563;
          }
          .footer {
            background: #f9fafb;
            padding: 24px 30px;
            border-radius: 0 0 8px 8px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 4px 0;
            color: #9ca3af;
            font-size: 13px;
          }
          .footer a {
            color: #4263eb;
            text-decoration: none;
          }
          .warning {
            color: #dc2626;
            font-size: 13px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Bem-vindo(a) ao Bootcamp Tulla!</h1>
          <p>Estamos muito felizes em ter você com a gente</p>
        </div>
        <div class="content">
          <p class="greeting">Oi, <strong>${firstName}</strong>! Tudo bem?</p>

          <p>
            Que bom que você chegou! A partir de agora você faz parte da nossa comunidade
            de desenvolvedores e estamos aqui para te acompanhar em cada passo dessa jornada.
          </p>

          <p>
            Preparamos tudo com muito carinho para que sua experiência seja incrível.
            Vamos aprender, praticar e crescer juntos!
          </p>

          ${
            temporaryPassword
              ? `
          <div class="credentials">
            <h3>Seus dados de acesso:</h3>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Senha:</strong> <span class="password-value">${temporaryPassword}</span></p>
            <p class="warning">Por segurança, recomendamos que altere sua senha no primeiro acesso.</p>
          </div>
          `
              : ""
          }

          <div class="steps">
            <h3>Como acessar a plataforma:</h3>
            <ol>
              <li>Clique no botão abaixo para acessar a plataforma</li>
              <li>Use o email e a senha enviados acima para fazer login</li>
              <li>Explore os cursos e comece a estudar!</li>
            </ol>
          </div>

          <center>
            <a href="${platformUrl}/login" class="cta-button">
              Acessar a Plataforma
            </a>
          </center>

          <p style="margin-top: 28px;">
            Se tiver qualquer dúvida, é só responder este email ou falar com a gente.
            Estamos aqui para ajudar!
          </p>

          <p>
            Um grande abraço,<br>
            <strong>Equipe Tulla</strong>
          </p>
        </div>
        <div class="footer">
          <p><a href="${platformUrl}">${platformUrl}</a></p>
          <p>Bootcamp Tulla - Transformando carreiras em tecnologia</p>
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
