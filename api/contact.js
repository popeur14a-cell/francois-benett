const SUJETS = {
  artwork: "Demande concernant une œuvre",
  exhibition: "Proposition d’exposition",
  project: "Projet artistique",
  other: "Autre demande",
};

function nettoyer(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function echapperHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Méthode non autorisée." });
  }

  if (!process.env.RESEND_API_KEY) {
    return response.status(503).json({ error: "Service e-mail non configuré." });
  }

  const nom = nettoyer(request.body?.nom, 100);
  const email = nettoyer(request.body?.email, 200).toLowerCase();
  const sujetCode = nettoyer(request.body?.sujet, 30);
  const message = nettoyer(request.body?.message, 5000);
  const siteWeb = nettoyer(request.body?.siteWeb, 200);
  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Champ invisible : les robots le remplissent souvent.
  if (siteWeb) return response.status(200).json({ success: true });

  if (!nom || !emailValide || !message || !SUJETS[sujetCode]) {
    return response.status(400).json({ error: "Informations invalides." });
  }

  const sujet = SUJETS[sujetCode];
  const nomHtml = echapperHtml(nom);
  const emailHtml = echapperHtml(email);
  const messageHtml = echapperHtml(message).replaceAll("\n", "<br />");
  const adresseExpediteur =
    process.env.CONTACT_FROM_EMAIL ||
    (process.env.RESEND_EMAIL_DOMAIN
      ? `Galerie François Benett <contact@${process.env.RESEND_EMAIL_DOMAIN}>`
      : "Galerie François Benett <onboarding@resend.dev>");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: adresseExpediteur,
        to: [
          process.env.CONTACT_TO_EMAIL || "benett.peintre@hotmail.fr",
        ],
        reply_to: email,
        subject: `[Site Benett] ${sujet}`,
        text: `Nom : ${nom}\nE-mail : ${email}\n\n${message}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171512">
            <h1 style="font-size:22px">Nouveau message depuis le site</h1>
            <p><strong>Nom :</strong> ${nomHtml}</p>
            <p><strong>E-mail :</strong> <a href="mailto:${emailHtml}">${emailHtml}</a></p>
            <p><strong>Sujet :</strong> ${echapperHtml(sujet)}</p>
            <hr style="border:0;border-top:1px solid #ddd0c0;margin:24px 0" />
            <p>${messageHtml}</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Erreur Resend:", detail);
      return response.status(502).json({ error: "Échec de l’envoi." });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur d’envoi:", error);
    return response.status(500).json({ error: "Échec de l’envoi." });
  }
}
