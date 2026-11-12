function isConfigured() {
  return Boolean(
    process.env.MAILERSEND_API_KEY &&
      process.env.MAIL_FROM &&
      process.env.COMMERCIAL_EMAIL
  );
}

async function sendEmail({ to, subject, html }) {
  if (!isConfigured()) {
    console.info(`[NOTIFICATION] ${subject} -> ${to} (e-mail não configurado)`);
    return { delivered: false, reason: "not-configured" };
  }

  const response = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: { email: process.env.MAIL_FROM, name: "EasyFood" },
      to: [{ email: to }],
      subject,
      html
    })
  });

  if (!response.ok) {
    throw new Error(`MailerSend respondeu com status ${response.status}`);
  }

  return { delivered: true };
}

async function restaurantCreated({ restaurant, owner }) {
  const escapedName = restaurant.name.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  return sendEmail({
    to: process.env.COMMERCIAL_EMAIL || owner.email,
    subject: `Novo restaurante cadastrado: ${restaurant.name}`,
    html: `<h2>Novo restaurante na EasyFood</h2><p><strong>${escapedName}</strong> foi cadastrado por ${owner.email}.</p>`
  });
}

module.exports = { restaurantCreated, sendEmail };
