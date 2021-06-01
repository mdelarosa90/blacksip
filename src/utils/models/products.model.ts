export class ProductModelApi {
  name: string;
  price: string;
  image: string;

  constructor(item?: ProductModelApi) {
    this.name = item?.name || "";
    this.price = item?.price || "";
    this.image = item?.image || "";
  }
}
