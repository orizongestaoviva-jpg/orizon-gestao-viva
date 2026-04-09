import { storagePut, storageGet } from "../storage";

// ============ GMAIL INTEGRATION ============
export async function sendEmailViaGmail(to: string, subject: string, body: string) {
  try {
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: Buffer.from(
          `To: ${to}\nSubject: ${subject}\n\n${body}`
        ).toString("base64"),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email via Gmail");
    }

    return { success: true, messageId: (await response.json()).id };
  } catch (error) {
    console.error("[Gmail] Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

// ============ OUTLOOK INTEGRATION ============
export async function sendEmailViaOutlook(to: string, subject: string, body: string) {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OUTLOOK_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: body },
          toRecipients: [{ emailAddress: { address: to } }],
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email via Outlook");
    }

    return { success: true };
  } catch (error) {
    console.error("[Outlook] Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

// ============ WHATSAPP INTEGRATION ============
export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send WhatsApp message");
    }

    return { success: true, messageId: (await response.json()).messages[0].id };
  } catch (error) {
    console.error("[WhatsApp] Error sending message:", error);
    return { success: false, error: String(error) };
  }
}

// ============ S3 INTEGRATION ============
export async function uploadFileToS3(filename: string, fileBuffer: Buffer, mimeType: string) {
  try {
    const key = `uploads/${Date.now()}-${filename}`;
    const result = await storagePut(key, fileBuffer, mimeType);
    return { success: true, url: result.url, key: result.key };
  } catch (error) {
    console.error("[S3] Error uploading file:", error);
    return { success: false, error: String(error) };
  }
}

export async function getFileFromS3(key: string, expiresIn: number = 3600) {
  try {
    const result = await storageGet(key, expiresIn);
    return { success: true, url: result.url };
  } catch (error) {
    console.error("[S3] Error getting file:", error);
    return { success: false, error: String(error) };
  }
}

// ============ WEBRTC INTEGRATION ============
export async function initiateWebRTCCall(initiatorId: string, recipientId: string) {
  try {
    // This would typically involve:
    // 1. Creating a signaling server connection
    // 2. Exchanging SDP offers/answers
    // 3. Managing ICE candidates
    // 4. Establishing peer connection

    return {
      success: true,
      callId: `call-${Date.now()}`,
      signalingServer: process.env.SIGNALING_SERVER_URL,
      stunServers: process.env.STUN_SERVERS?.split(",") || [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ],
    };
  } catch (error) {
    console.error("[WebRTC] Error initiating call:", error);
    return { success: false, error: String(error) };
  }
}

export async function endWebRTCCall(callId: string) {
  try {
    // Clean up call resources
    return { success: true };
  } catch (error) {
    console.error("[WebRTC] Error ending call:", error);
    return { success: false, error: String(error) };
  }
}

// ============ CALENDAR INTEGRATION ============
export async function syncGoogleCalendar(userId: string, accessToken: string) {
  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to sync Google Calendar");
    }

    const events = await response.json();
    return { success: true, events: events.items };
  } catch (error) {
    console.error("[Google Calendar] Error syncing:", error);
    return { success: false, error: String(error) };
  }
}

export async function syncOutlookCalendar(userId: string, accessToken: string) {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me/events", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to sync Outlook Calendar");
    }

    const events = await response.json();
    return { success: true, events: events.value };
  } catch (error) {
    console.error("[Outlook Calendar] Error syncing:", error);
    return { success: false, error: String(error) };
  }
}
