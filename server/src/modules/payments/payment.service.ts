import crypto from "crypto";
import axios from "axios";

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"; // UAT
const ESEWA_SECRET = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q"; // UAT secret
const ESEWA_FORM_URL =
  process.env.ESEWA_FORM_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // UAT/v2 form

function signBase64(message: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}

export interface EsewaInitInput {
  amount: number | string;
  tax_amount?: number | string;
  product_delivery_charge?: number | string;
  product_service_charge?: number | string;
  transaction_uuid: string;
  success_url: string;
  failure_url: string;
}

export const initEsewa = async (input: EsewaInitInput) => {
  const {
    amount,
    tax_amount = 0,
    product_delivery_charge = 0,
    product_service_charge = 0,
    transaction_uuid,
    success_url,
    failure_url,
  } = input;

  if (!amount || !transaction_uuid || !success_url || !failure_url) {
    const error: any = new Error("Missing fields");
    error.statusCode = 400;
    throw error;
  }

  const total_amount =
    Number(amount) +
    Number(tax_amount) +
    Number(product_delivery_charge) +
    Number(product_service_charge);

  const signed_field_names = "total_amount,transaction_uuid,product_code";

  const payload = {
    amount: String(amount),
    tax_amount: String(tax_amount),
    total_amount: String(total_amount),
    transaction_uuid: String(transaction_uuid),
    product_code: ESEWA_PRODUCT_CODE,
    product_service_charge: String(product_service_charge),
    product_delivery_charge: String(product_delivery_charge),
    success_url,
    failure_url,
    signed_field_names,
  };

  const message = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;
  const signature = signBase64(message, ESEWA_SECRET);

  return {
    formUrl: ESEWA_FORM_URL,
    fields: { ...payload, signature },
  };
};

export const checkEsewaStatus = async (uuid: string, total: string) => {
  if (!uuid || !total) {
    const error: any = new Error("Missing params");
    error.statusCode = 400;
    throw error;
  }

  const url = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${encodeURIComponent(
    total
  )}&transaction_uuid=${encodeURIComponent(uuid)}`;

  const { data } = await axios.get(url);
  return data;
};

export default {
  initEsewa,
  checkEsewaStatus,
};
