import { services } from "@nails/core";
import { apiJson, optionsResponse } from "../../../lib/cors";

export async function GET() {
  return apiJson(services);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return apiJson(
    {
      id: "srv-new",
      allowsDesignExtra: false,
      ...payload
    },
    { status: 201 }
  );
}

export async function OPTIONS() {
  return optionsResponse();
}

