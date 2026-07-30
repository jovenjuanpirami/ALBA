import { NextResponse } from "next/server";
import { fetchTableRows, toCsv } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const table = url.searchParams.get("table");
  const expected = process.env.ADMIN_DASHBOARD_TOKEN;

  if (!expected || token !== expected) {
    return new NextResponse("No encontrado", { status: 404 });
  }
  if (table !== "events" && table !== "waitlist") {
    return NextResponse.json({ error: "table debe ser events o waitlist" }, { status: 400 });
  }

  const rows = await fetchTableRows(table);
  // BOM para que Excel en Windows abra los acentos correctamente.
  const csv = `﻿${toCsv(rows)}`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alba-${table}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
