export class Endpoints {
  static _API_URL = "https://blackisp.herokuapp.com";

  static set API_URL(url) {
    Endpoints._API_URL = url;
  }
  static get API_URL() {
    return Endpoints._API_URL;
  }

  static _PRODUCTS = "/products"; /**LISTA LOS PRODUCTOS */
  static _CONTACT = "/contact"; /**FORMULARIO DE CONTACTO */
  static _POSTAL_CODES = "/postalCodes"; /**LISTAR COLONIAS, MUNICIPIOS, ETC */
}
