import { NextResponse } from "next/server";

type Lead = {
  name?: string;
  brand?: string;
  email?: string;
  need?: string;
  message?: string;
  source?: string;
  website?: string;
};

const clean = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.LEAD_EMAIL || "vishnuprakash406@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !recipient || !from) {
    return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
  }

  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const brand = clean(body.brand, 160);
  const email = clean(body.email, 180);
  const need = clean(body.need, 180);
  const message = clean(body.message, 1200);
  const source = clean(body.source, 100);

  if (!name || !brand || !email || !need || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }

  const delivery = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: email,
      subject: `New Mia enquiry: ${brand}`,
      text: [
        "New website enquiry from Mia",
        "",
        `Name: ${name}`,
        `Brand: ${brand}`,
        `Email: ${email}`,
        `Need: ${need}`,
        `Source: ${source}`,
        "",
        "Message:",
        message
      ].join("\n")
    })
  });

  if (!delivery.ok) {
    return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
