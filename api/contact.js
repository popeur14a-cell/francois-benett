const SUBJECTS = {
  artwork: "Demande concernant une œuvre",
  exhibition: "Proposition d’exposition",
  project: "Projet artistique",
  other: "Autre demande",
};

const rateLimits = new Map();

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRateLimited(request) {
  const ip = clean(
    request.headers["x-forwarded-for"]?.split(",")[0] ||
      request.headers["x-real-ip"] ||
      "unknown",
    100
  );
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return true;
  rateLimits.set(ip, [...recent, now]);
  return false;
}

async function sendEmail(apiKey, payload, idempotencyKey) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Méthode non autorisée." });
  }
  if (!process.env.RESEND_API_KEY) {
    return response.status(503).json({ error: "Service e-mail non configuré." });
  }

  const nom = clean(request.body?.nom, 100);
  const email = clean(request.body?.email, 200).toLowerCase();
  const subjectCode = clean(request.body?.sujet, 30);
  const message = clean(request.body?.message, 5000);
  const website = clean(request.body?.siteWeb, 200);
  const artwork = clean(request.body?.artwork, 200);
  const groupedWorks = clean(request.body?.groupedWorks, 1000);
  const dimensions = clean(request.body?.dimensions, 100);
  const collection = clean(request.body?.collection, 100);
  const artworkUrl = clean(request.body?.artworkUrl, 500);
  const language = clean(request.body?.language, 5) === "en" ? "en" : "fr";
  const requestId = clean(request.body?.requestId, 120).replace(/[^a-zA-Z0-9-]/g, "");
  const startedAt = Number(request.body?.startedAt);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const messageWordCount = message.split(/\s+/).filter(Boolean).length;

  if (website) return response.status(200).json({ success: true });
  if (Number.isFinite(startedAt) && Date.now() - startedAt < 1500) {
    return response.status(400).json({ error: "Envoi trop rapide." });
  }
  if (!nom || !emailValid || messageWordCount < 5 || !SUBJECTS[subjectCode]) {
    return response.status(400).json({ error: "Informations invalides." });
  }
  if (isRateLimited(request)) {
    return response.status(429).json({ error: "Trop de demandes. Réessayez plus tard." });
  }

  const subject = artwork
    ? `Nouvelle demande concernant ${artwork} — benett-peintre.fr`
    : groupedWorks
      ? "Nouvelle demande concernant plusieurs œuvres — benett-peintre.fr"
      : `[Site Benett] ${SUBJECTS[subjectCode]}`;
  const sender =
    process.env.CONTACT_FROM_EMAIL ||
    (process.env.RESEND_EMAIL_DOMAIN
      ? `Galerie François Benett <contact@${process.env.RESEND_EMAIL_DOMAIN}>`
      : "Galerie François Benett <onboarding@resend.dev>");
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date());

  const details = [
    ["Nom", nom],
    ["E-mail", email],
    ["Œuvre", artwork || groupedWorks],
    ["Dimensions", dimensions],
    ["Collection", collection],
    ["Lien direct", artworkUrl],
    ["Langue du site", language.toUpperCase()],
    ["Date", date],
  ].filter(([, value]) => value);

  const detailsHtml = details
    .map(([label, value]) => `<p><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value)}</p>`)
    .join("");
  const detailsText = details.map(([label, value]) => `${label} : ${value}`).join("\n");
  const key = requestId || `${Date.now()}-${email.replace(/[^a-z0-9]/g, "")}`;

  try {
    const ownerResponse = await sendEmail(
      process.env.RESEND_API_KEY,
      {
        from: sender,
        to: [process.env.CONTACT_TO_EMAIL || "benett.peintre@hotmail.fr"],
        reply_to: email,
        subject,
        text: `${detailsText}\n\nMessage :\n${message}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#171512"><h1 style="font-size:22px">Nouvelle demande depuis le site</h1>${detailsHtml}<hr style="border:0;border-top:1px solid #ddd0c0;margin:24px 0"><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p></div>`,
      },
      `benett-owner-${key}`
    );

    if (!ownerResponse.ok) {
      console.error("Erreur Resend:", await ownerResponse.text());
      return response.status(502).json({ error: "Échec de l’envoi." });
    }

    const confirmationSubject =
      language === "en" ? "Your enquiry has been received — François Benett" : "Votre demande a bien été reçue — François Benett";
    const confirmationText =
      language === "en"
        ? `Hello ${nom},\n\nYour enquiry${artwork ? ` about “${artwork}”` : ""} has been received. François Benett will reply as soon as possible.\n\nThis message is not a purchase or reservation confirmation.`
        : `Bonjour ${nom},\n\nVotre demande${artwork ? ` concernant « ${artwork} »` : ""} a bien été reçue. François Benett vous répondra dès que possible.\n\nCe message ne constitue ni une confirmation d’achat ni une réservation.`;

    const confirmationResponse = await sendEmail(
      process.env.RESEND_API_KEY,
      {
        from: sender,
        to: [email],
        subject: confirmationSubject,
        text: confirmationText,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#171512;max-width:600px"><h1 style="font-size:24px;font-weight:500">${escapeHtml(confirmationSubject)}</h1><p>${escapeHtml(confirmationText).replaceAll("\n", "<br>")}</p></div>`,
      },
      `benett-confirmation-${key}`
    );
    if (!confirmationResponse.ok) {
      console.error("Erreur confirmation Resend:", await confirmationResponse.text());
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur d’envoi:", error);
    return response.status(500).json({ error: "Échec de l’envoi." });
  }
}
