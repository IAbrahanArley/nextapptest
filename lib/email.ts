import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  to: string,
  name: string,
  temporaryPassword: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: "API Key do Resend não configurada" };
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject: "Bem-vindo ao BranlyClub - Sua senha temporária",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  
  <!-- HEADER -->
  <div style="background: linear-gradient(135deg, #00C6FF 0%, #0040FF 100%); padding: 30px; text-align: center; color: white;">
    <img src="${
      process.env.NEXT_PUBLIC_LOGO
    }" alt="Branly Software" style="width: 100px; height: 100px; margin-bottom: 10px;">
    <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">Sistema de Fidelidade</p>
  </div>

  <!-- BODY -->
  <div style="padding: 30px; background: #ffffff;">
    <h2 style="color: #002B5B; margin-bottom: 20px;">Olá, ${name}!</h2>
    
    <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
      Você foi cadastrado com sucesso no sistema de fidelidade <strong>BranlyClub</strong>!
    </p>
    
    <!-- PASSWORD BOX -->
    <div style="background: #E6F7FF; border: 1px solid #00C6FF; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #0040FF; margin: 0 0 15px 0;">Sua senha temporária:</h3>
      <div style="background: white; border: 2px dashed #00C6FF; border-radius: 6px; padding: 15px; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #0040FF; letter-spacing: 2px;">
          ${temporaryPassword}
        </span>
      </div>
    </div>
    
    <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
      <strong>Importante:</strong> Esta é uma senha temporária. Por favor, altere-a no seu primeiro acesso.
    </p>
    
    <!-- SECURITY TIP -->
    <div style="background: #FFF8E5; border: 1px solid #FFD54F; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="color: #8D6E00; margin: 0; font-size: 14px;">
        <strong>Dica de segurança:</strong> Use uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
      </p>
    </div>
    
    <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
      Se você tiver alguma dúvida, entre em contato com o suporte.
    </p>
    
    <!-- CTA BUTTON -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" 
         style="background: linear-gradient(135deg, #00C6FF 0%, #0040FF 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Acessar BranlyClub
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background: #0A0A0A; padding: 20px; text-align: center; color: white; font-size: 12px;">
    <p style="margin: 0;">© 2024 BranlyClub. Todos os direitos reservados.</p>
    <p style="margin: 5px 0 0 0;">Este é um email automático, não responda a esta mensagem.</p>
  </div>
</div>

      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Erro interno ao enviar email" };
  }
}

export function generateTemporaryPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  password += chars.charAt(Math.floor(Math.random() * 26));
  password += chars.charAt(26 + Math.floor(Math.random() * 26));
  password += chars.charAt(52 + Math.floor(Math.random() * 10));

  for (let i = 3; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export async function testPasswordEncryption(password: string): Promise<{
  original: string;
  hashed: string;
  isValid: boolean;
}> {
  const bcrypt = require("bcryptjs");
  const hashed = await bcrypt.hash(password, 12);
  const isValid = await bcrypt.compare(password, hashed);

  return {
    original: password,
    hashed: hashed,
    isValid: isValid,
  };
}

export async function sendPointsAttributionEmail(
  to: string,
  name: string,
  points: number,
  storeName: string,
  reason: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: "API Key do Resend não configurada" };
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject: `🎉 ${points} pontos adicionados à sua conta BranlyClub!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  
  <!-- HEADER -->
  <div style="background: linear-gradient(135deg, #00C6FF 0%, #0040FF 100%); padding: 30px; text-align: center; color: white;">
    <img src="${
      process.env.NEXT_PUBLIC_LOGO
    }" alt="Branly Software" style="width: 100px; height: 100px; margin-bottom: 10px;">
    <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">Sistema de Fidelidade</p>
  </div>

  <!-- BODY -->
  <div style="padding: 30px; background: #ffffff;">
    <h2 style="color: #002B5B; margin-bottom: 20px;">Olá, ${name}!</h2>
    
    <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
      Você recebeu <strong>${points} pontos</strong> na loja <strong>${storeName}</strong>!
    </p>
    
    <!-- POINTS BOX -->
    <div style="background: #E6F7FF; border: 1px solid #00C6FF; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #0040FF; margin: 0 0 15px 0;">🎯 Pontos Adicionados:</h3>
      <div style="background: white; border: 2px dashed #00C6FF; border-radius: 6px; padding: 15px; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #0040FF; letter-spacing: 2px;">
          +${points} pontos
        </span>
      </div>
    </div>
    
    <!-- REASON BOX -->
    <div style="background: #F0F8FF; border: 1px solid #87CEEB; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h4 style="color: #0040FF; margin: 0 0 10px 0;">📝 Motivo:</h4>
      <p style="color: #444; margin: 0; font-style: italic;">${reason}</p>
    </div>
    
    <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
      <strong>Parabéns!</strong> Continue acumulando pontos para trocar por prêmios incríveis.
    </p>
    
    <!-- INFO BOX -->
    <div style="background: #FFF8E5; border: 1px solid #FFD54F; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="color: #8D6E00; margin: 0; font-size: 14px;">
        <strong>💡 Dica:</strong> Acesse sua conta para ver seu saldo atual de pontos e os prêmios disponíveis para troca.
      </p>
    </div>
    
    <!-- CTA BUTTON -->
    <div style="text-align: center; margin-top: 30px;">
      <a href="${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/cliente/pontos" 
         style="background: linear-gradient(135deg, #00C6FF 0%, #0040FF 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
        Ver Meus Pontos
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background: #0A0A0A; padding: 20px; text-align: center; color: white; font-size: 12px;">
    <p style="margin: 0;">© 2024 BranlyClub. Todos os direitos reservados.</p>
    <p style="margin: 5px 0 0 0;">Este é um email automático, não responda a esta mensagem.</p>
  </div>
</div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Erro interno ao enviar email" };
  }
}
