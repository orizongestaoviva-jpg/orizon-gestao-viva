import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { analyzeClimate, analyzePerformance, detectBurnoutRisk, generateRecommendations } from "./_core/ai";
import { sendEmailViaGmail, sendEmailViaOutlook, sendWhatsAppMessage, uploadFileToS3, initiateWebRTCCall } from "./_core/integrations";

// ============ AI ROUTERS ============
export const aiRouter = router({
  analyzeClimate: protectedProcedure
    .input(z.object({ surveyData: z.array(z.any()) }))
    .mutation(async ({ input }) => {
      const analysis = await analyzeClimate(input.surveyData);
      return { success: true, analysis };
    }),

  analyzePerformance: protectedProcedure
    .input(z.object({ performanceData: z.array(z.any()) }))
    .mutation(async ({ input }) => {
      const analysis = await analyzePerformance(input.performanceData);
      return { success: true, analysis };
    }),

  detectBurnout: protectedProcedure
    .input(z.object({ employeeData: z.any() }))
    .mutation(async ({ input }) => {
      const analysis = await detectBurnoutRisk(input.employeeData);
      return { success: true, analysis };
    }),

  generateRecommendations: protectedProcedure
    .input(z.object({ companyData: z.any() }))
    .mutation(async ({ input }) => {
      const recommendations = await generateRecommendations(input.companyData);
      return { success: true, recommendations };
    }),
});

// ============ INTEGRATIONS ROUTERS ============
export const integrationsRouter = router({
  sendEmailGmail: protectedProcedure
    .input(z.object({ to: z.string().email(), subject: z.string(), body: z.string() }))
    .mutation(async ({ input }) => {
      const result = await sendEmailViaGmail(input.to, input.subject, input.body);
      return result;
    }),

  sendEmailOutlook: protectedProcedure
    .input(z.object({ to: z.string().email(), subject: z.string(), body: z.string() }))
    .mutation(async ({ input }) => {
      const result = await sendEmailViaOutlook(input.to, input.subject, input.body);
      return result;
    }),

  sendWhatsApp: protectedProcedure
    .input(z.object({ phoneNumber: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      const result = await sendWhatsAppMessage(input.phoneNumber, input.message);
      return result;
    }),

  uploadFileS3: protectedProcedure
    .input(z.object({ filename: z.string(), mimeType: z.string(), fileBuffer: z.any() }))
    .mutation(async ({ input }) => {
      const result = await uploadFileToS3(input.filename, input.fileBuffer, input.mimeType);
      return result;
    }),

  initiateCall: protectedProcedure
    .input(z.object({ recipientId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const result = await initiateWebRTCCall(String(ctx.user.id), input.recipientId);
      return result;
    }),
});

// ============ EXTENDED ROUTERS ============
export const extendedRouter = router({
  ai: aiRouter,
  integrations: integrationsRouter,
});
