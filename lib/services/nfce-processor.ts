import { db } from "@/lib/db";
import { nfceScans, storePartnerships, nfceFraudLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export interface NFCEData {
  nfceKey: string;
  sefazUrl: string;
  cnpj: string;
  totalValue: number;
  purchaseDate: Date;
  items?: any[];
}

export interface ValidationResult {
  isValid: boolean;
  pointsEarned: number;
  fraudScore: number;
  rejectionReason?: string;
  partnership?: any;
}

export class NFCeProcessor {
  private static readonly MAX_DAYS_OLD = 30; // Notas com mais de 30 dias são rejeitadas
  private static readonly MAX_SCANS_PER_HOUR = 10; // Máximo de scans por hora por usuário
  private static readonly FRAUD_THRESHOLD = 70; // Score acima de 70 = fraude

  /**
   * Processa uma NFC-e escaneada e valida todos os aspectos legais e técnicos
   */
  static async processNFCE(
    userId: string,
    storeId: string,
    nfceData: NFCEData,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ValidationResult> {
    try {
      // 1. Validação básica da NFC-e
      const basicValidation = this.validateBasicNFCE(nfceData);
      if (!basicValidation.isValid) {
        return basicValidation;
      }

      // 2. Verificar se já foi escaneada (prevenir duplicatas)
      const existingScan = await this.checkDuplicateScan(nfceData.nfceKey);
      if (existingScan) {
        await this.logFraud(
          "duplicate_scan",
          100,
          nfceData.nfceKey,
          userId,
          ipAddress,
          userAgent
        );
        return {
          isValid: false,
          pointsEarned: 0,
          fraudScore: 100,
          rejectionReason: "Esta nota fiscal já foi escaneada anteriormente",
        };
      }

      // 3. Verificar limite de scans por hora
      const hourlyLimit = await this.checkHourlyLimit(userId);
      if (!hourlyLimit.allowed) {
        await this.logFraud(
          "rate_limit_exceeded",
          80,
          nfceData.nfceKey,
          userId,
          ipAddress,
          userAgent
        );
        return {
          isValid: false,
          pointsEarned: 0,
          fraudScore: 80,
          rejectionReason:
            "Limite de scans por hora excedido. Tente novamente mais tarde.",
        };
      }

      // 4. Verificar parceria com o estabelecimento
      const partnership = await this.validatePartnership(
        storeId,
        nfceData.cnpj
      );
      if (!partnership) {
        await this.logFraud(
          "non_partner_store",
          90,
          nfceData.nfceKey,
          userId,
          ipAddress,
          userAgent
        );
        return {
          isValid: false,
          pointsEarned: 0,
          fraudScore: 90,
          rejectionReason:
            "Este estabelecimento não é parceiro do programa de fidelidade",
        };
      }

      // 5. Calcular pontos baseado no valor e multiplicador da parceria
      const pointsEarned = Math.floor(
        nfceData.totalValue * parseFloat(partnership.pointsMultiplier)
      );

      // 6. Calcular score de fraude
      const fraudScore = this.calculateFraudScore(nfceData, partnership);

      // 7. Se score de fraude for alto, rejeitar
      if (fraudScore >= this.FRAUD_THRESHOLD) {
        await this.logFraud(
          "suspicious_pattern",
          fraudScore,
          nfceData.nfceKey,
          userId,
          ipAddress,
          userAgent
        );
        return {
          isValid: false,
          pointsEarned: 0,
          fraudScore,
          rejectionReason:
            "Padrão suspeito detectado. Entre em contato com o suporte.",
        };
      }

      // 8. Salvar o scan no banco
      await this.saveNFCEscan(
        userId,
        storeId,
        nfceData,
        pointsEarned,
        fraudScore,
        ipAddress,
        userAgent
      );

      return {
        isValid: true,
        pointsEarned,
        fraudScore,
        partnership,
      };
    } catch (error) {
      console.error("Erro ao processar NFC-e:", error);
      return {
        isValid: false,
        pointsEarned: 0,
        fraudScore: 100,
        rejectionReason: "Erro interno do sistema. Tente novamente.",
      };
    }
  }

  /**
   * Validação básica da estrutura da NFC-e
   */
  private static validateBasicNFCE(nfceData: NFCEData): ValidationResult {
    // Verificar se a nota não é muito antiga
    const daysDiff = Math.floor(
      (Date.now() - nfceData.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > this.MAX_DAYS_OLD) {
      return {
        isValid: false,
        pointsEarned: 0,
        fraudScore: 85,
        rejectionReason: `Nota fiscal muito antiga (${daysDiff} dias). Aceitamos apenas notas de até ${this.MAX_DAYS_OLD} dias.`,
      };
    }

    // Verificar se o valor é razoável
    if (nfceData.totalValue <= 0 || nfceData.totalValue > 100000) {
      return {
        isValid: false,
        pointsEarned: 0,
        fraudScore: 95,
        rejectionReason: "Valor da nota fiscal inválido",
      };
    }

    // Verificar se o CNPJ tem formato válido
    if (!/^\d{14}$/.test(nfceData.cnpj)) {
      return {
        isValid: false,
        pointsEarned: 0,
        fraudScore: 95,
        rejectionReason: "CNPJ inválido",
      };
    }

    return {
      isValid: true,
      pointsEarned: 0,
      fraudScore: 0,
    };
  }

  /**
   * Verifica se a NFC-e já foi escaneada
   */
  private static async checkDuplicateScan(nfceKey: string): Promise<boolean> {
    const existing = await db
      .select({ id: nfceScans.id })
      .from(nfceScans)
      .where(eq(nfceScans.nfceKey, nfceKey))
      .limit(1);

    return existing.length > 0;
  }

  /**
   * Verifica limite de scans por hora
   */
  private static async checkHourlyLimit(
    userId: string
  ): Promise<{ allowed: boolean; count: number }> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentScans = await db
      .select({ id: nfceScans.id })
      .from(nfceScans)
      .where(and(eq(nfceScans.userId, userId), desc(nfceScans.scannedAt)));

    const hourlyCount = recentScans.filter(
      (scan) => new Date(scan.scannedAt) > oneHourAgo
    ).length;

    return {
      allowed: hourlyCount < this.MAX_SCANS_PER_HOUR,
      count: hourlyCount,
    };
  }

  /**
   * Valida se existe parceria com o estabelecimento
   */
  private static async validatePartnership(
    storeId: string,
    cnpj: string
  ): Promise<any | null> {
    const partnership = await db
      .select()
      .from(storePartnerships)
      .where(
        and(
          eq(storePartnerships.storeId, storeId),
          eq(storePartnerships.partnerCnpj, cnpj),
          eq(storePartnerships.isActive, true)
        )
      )
      .limit(1);

    return partnership[0] || null;
  }

  /**
   * Calcula score de fraude baseado em vários fatores
   */
  private static calculateFraudScore(
    nfceData: NFCEData,
    partnership: any
  ): number {
    let score = 0;

    // Fator: Nota muito antiga
    const daysDiff = Math.floor(
      (Date.now() - nfceData.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > 15) score += 20;
    if (daysDiff > 25) score += 30;

    // Fator: Valor muito alto (pode indicar fraude)
    if (nfceData.totalValue > 10000) score += 15;
    if (nfceData.totalValue > 50000) score += 25;

    // Fator: Tipo de parceria (franquias podem ter score menor)
    if (partnership.partnershipType === "franchise") score -= 10;
    if (partnership.partnershipType === "affiliate") score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Salva o scan da NFC-e no banco
   */
  private static async saveNFCEscan(
    userId: string,
    storeId: string,
    nfceData: NFCEData,
    pointsEarned: number,
    fraudScore: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(nfceScans).values({
      userId,
      storeId,
      nfceKey: nfceData.nfceKey,
      sefazUrl: nfceData.sefazUrl,
      cnpj: nfceData.cnpj,
      totalValue: nfceData.totalValue.toString(),
      purchaseDate: nfceData.purchaseDate,
      items: nfceData.items || [],
      pointsEarned,
      fraudScore,
      ipAddress,
      userAgent,
      status: fraudScore > this.FRAUD_THRESHOLD ? "fraud_detected" : "pending",
    });
  }

  /**
   * Registra tentativa de fraude
   */
  private static async logFraud(
    fraudType: string,
    fraudScore: number,
    nfceKey: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(nfceFraudLogs).values({
      nfceKey,
      userId,
      fraudType: fraudType as any,
      fraudScore,
      ipAddress,
      userAgent,
      details: { timestamp: new Date().toISOString() },
    });
  }

  /**
   * Extrai dados da URL da SEFAZ (simulação - cada estado tem formato diferente)
   */
  static async extractDataFromSEFAZ(url: string): Promise<NFCEData | null> {
    try {
      // Aqui você implementaria a lógica específica para cada estado
      // Por enquanto, vamos simular com uma URL de exemplo

      const urlObj = new URL(url);
      const params = urlObj.searchParams;

      // Exemplo para SEFAZ-SP
      if (url.includes("sefaz.sp.gov.br")) {
        const p = params.get("p");
        if (p) {
          // Formato: 35190612345678901234550010000123456789012345|2|1|1|1234567890ABCDEF
          const parts = p.split("|");
          if (parts.length >= 5) {
            const nfceKey = parts[0];
            const cnpj = nfceKey.substring(6, 20); // Extrai CNPJ da chave
            const totalValue = parseFloat(parts[2]) / 100; // Valor em centavos

            return {
              nfceKey,
              sefazUrl: url,
              cnpj,
              totalValue,
              purchaseDate: new Date(), // Aqui você extrairia a data real
              items: [],
            };
          }
        }
      }

      // Exemplo para SEFAZ-RS
      if (url.includes("sefaz.rs.gov.br")) {
        const p = params.get("p");
        if (p) {
          // Implementar lógica específica para RS
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Erro ao extrair dados da SEFAZ:", error);
      return null;
    }
  }
}
