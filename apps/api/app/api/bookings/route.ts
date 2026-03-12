import { bookings } from "@nails/core";
import { apiJson, optionsResponse } from "../../../lib/cors";

export async function GET() {
  return apiJson(bookings);
}

export async function POST(request: Request) {
  const payload = await request.json();
  return apiJson(
    {
      id: "bok-new",
      status: "prevista",
      ...payload
    },
    { status: 201 }
  );
}

export async function OPTIONS() {
  return optionsResponse();
}

