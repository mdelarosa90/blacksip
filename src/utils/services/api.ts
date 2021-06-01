import { ContactModelApi } from "../models/contact.model";
import { Endpoints } from "./Endpoints";

const API_URL = Endpoints.API_URL;

interface apiFetchProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: any;
  params?: any;
  headers?: Headers;
}

export const apiFetch = async ({
  url,
  method = "GET",
  params,
  headers,
}: apiFetchProps) => {
  const beforeFetch = Date.now();
  const endpoint = url.startsWith("/") ? API_URL + url : url;
  const header = !headers
    ? {
        "Content-Type": "application/json",
      }
    : headers;
  try {
    const dataResult = await fetch(endpoint, {
      headers: header,
      method,
      body: method === "GET" ? undefined : JSON.stringify(params),
    });
    if (!dataResult.ok) {
      const { error } = await dataResult.json();
      const err = new Error(error);
      // err.responseCode = dataJson.responseCode;
      throw err;
    }
    const dataJson = await dataResult.json();
    const timeElapsed = (Date.now() - beforeFetch) / 1000;
    console.log("Fetch-API OK", url, "- in", timeElapsed);
    return dataJson;
  } catch (error) {
    if (error?.message.toLowerCase() === "network request failed") {
      error.message = "Ocurrió un problema con la conexión";
    }
    const timeElapsed = (Date.now() - beforeFetch) / 1000;
    console.log("Fetch-API FAIL", url, "- in", timeElapsed, error);
    //error.requestUrl = endpoint;
    throw error;
  }
};

export const getProducts = () => {
  return apiFetch({ url: Endpoints._PRODUCTS });
};

export const getLocalities = (postalCode: string | number) => {
  return apiFetch({ url: `${Endpoints._POSTAL_CODES}/${postalCode}` });
};

export const register = (data: ContactModelApi) => {
  return apiFetch({ url: Endpoints._CONTACT, method: "POST", params: data });
};
