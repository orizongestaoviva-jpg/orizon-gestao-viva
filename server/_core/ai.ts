import { invokeLLM } from "./llm";

export async function analyzeClimate(surveys: any[]) {
  const prompt = `Analise os seguintes dados de clima organizacional e forneça insights:
${JSON.stringify(surveys, null, 2)}

Forneça:
1. Pontuação geral de clima (0-100)
2. Principais pontos positivos
3. Áreas críticas de melhoria
4. Recomendações acionáveis
5. Risco de turnover (baixo/médio/alto)`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um especialista em clima organizacional e gestão de pessoas. Analise dados de pesquisas de clima e forneça insights profundos e acionáveis.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message.content || "";
}

export async function analyzePerformance(performanceData: any[]) {
  const prompt = `Analise os seguintes dados de performance:
${JSON.stringify(performanceData, null, 2)}

Forneça:
1. Avaliação geral de performance (0-100)
2. Top performers
3. Colaboradores que precisam de suporte
4. Tendências de performance
5. Recomendações de desenvolvimento`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um especialista em gestão de performance. Analise dados de performance e forneça insights para melhorar resultados.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message.content || "";
}

export async function detectBurnoutRisk(employeeData: any) {
  const prompt = `Analise o seguinte perfil de colaborador para detectar risco de burnout:
${JSON.stringify(employeeData, null, 2)}

Forneça:
1. Nível de risco de burnout (baixo/médio/alto/crítico)
2. Sinais de alerta identificados
3. Fatores contribuintes
4. Recomendações de intervenção
5. Ações imediatas necessárias`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um especialista em saúde ocupacional e bem-estar. Identifique riscos de burnout e recomende intervenções.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message.content || "";
}

export async function generateRecommendations(companyData: any) {
  const prompt = `Com base nos seguintes dados da empresa, gere recomendações estratégicas:
${JSON.stringify(companyData, null, 2)}

Forneça:
1. Recomendações de curto prazo (1-3 meses)
2. Recomendações de médio prazo (3-6 meses)
3. Recomendações de longo prazo (6-12 meses)
4. Métricas de sucesso
5. Próximos passos`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um consultor estratégico de gestão de pessoas. Gere recomendações baseadas em dados.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message.content || "";
}

export async function generateInsights(data: any, topic: string) {
  const prompt = `Gere insights sobre ${topic}:
${JSON.stringify(data, null, 2)}

Forneça análise profunda com recomendações acionáveis.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Você é um analista de dados especializado em gestão de pessoas. Gere insights profundos e acionáveis.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message.content || "";
}
