
const crypto = require("crypto");

const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"; // UAT
const ESEWA_SECRET = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";      // UAT secret
const ESEWA_FORM_URL =
  process.env.ESEWA_FORM_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // UAT/v2 form


function signBase64(message, secret) {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}


exports.initEsewa = async (req, res) => {
  try {
    const {
      amount,
      tax_amount = 0,
      product_delivery_charge = 0,
      product_service_charge = 0,
      transaction_uuid,
      success_url,
      failure_url,
    } = req.body;

    if (!amount || !transaction_uuid || !success_url || !failure_url) {
      return res.status(400).json({ success: false, message: "Missing fields" });
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

    return res.json({
      success: true,
      formUrl: ESEWA_FORM_URL,
      fields: { ...payload, signature },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const axios = require("axios");
exports.statusEsewa = async (req, res) => {
  try {
    const { uuid, total } = req.query;
    if (!uuid || !total) {
      return res.status(400).json({ success: false, message: "Missing params" });
    }
    const url = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${encodeURIComponent(
      total
    )}&transaction_uuid=${encodeURIComponent(uuid)}`;

    const { data } = await axios.get(url);
  
    return res.json({ success: true, data });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    res.status(502).json({ success: false, message: "Status check failed" });
  }
};
