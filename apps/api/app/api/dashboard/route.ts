import { bookingSuggestions, dashboardSummary, technicians } from "@nails/core";
import { apiJson, optionsResponse } from "../../../lib/cors";

export async function GET() {
  return apiJson({
    ...dashboardSummary,
    activeTechnicians: technicians.length,
    bookingSuggestions
  });
}

export async function OPTIONS() {
  return optionsResponse();
}
