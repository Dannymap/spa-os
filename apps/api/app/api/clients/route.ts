import { clients } from "@nails/core";
import { apiJson, optionsResponse } from "../../../lib/cors";

export async function GET() {
  return apiJson(clients);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return apiJson(
    {
      id: "cli-new",
      visits: 0,
      vip: false,
      allergies: [],
      favoriteColors: [],
      usualShape: "Sin definir",
      usualLength: "Sin definir",
      lastPhotos: [],
      lastVisit: new Date().toISOString().slice(0, 10),
      ...payload
    },
    { status: 201 }
  );
}

export async function OPTIONS() {
  return optionsResponse();
}

