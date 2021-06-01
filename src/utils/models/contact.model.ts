export class ContactModelApi {
  name: string;
  lastName: string;
  telephone: string;
  email: string;
  code: string;
  state: string;
  town: string;
  colony: string;
  city: string;
  street: string;
  policy: boolean;

  constructor(item?: ContactModelApi) {
    this.name = item?.name || "";
    this.lastName = item?.lastName || "";
    this.telephone = item?.telephone || "";
    this.email = item?.email || "";
    this.code = item?.code || "";
    this.state = item?.state || "";
    this.town = item?.town || "";
    this.colony = item?.colony || "";
    this.city = item?.city || "";
    this.street = item?.street || "";
    this.policy = item?.policy || true;
  }
}
