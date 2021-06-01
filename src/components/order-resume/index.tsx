import React, { useEffect, useMemo, useState } from "react";
import { ProductModelApi } from "../../utils/models/products.model";
import { getProducts } from "../../utils/services/api";
import "./styles.scss";

/**
 * Number.prototype.format(n, x)
 *
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */

declare global {
  interface Number {
    format(n: number, x: number): string;
  }
}
Number.prototype.format = function (n, x) {
  const re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
};

const OrderResume = () => {
  const [products, setProducts] = useState<Array<ProductModelApi>>([]);
  useEffect(() => {
    (async () => {
      try {
        const products = await getProducts();
        if (!!products) setProducts(products);
      } catch (error) {
        throw error;
      }
    })();
  }, []);

  const total = useMemo(() => {
    let sumTotal = 0;
    if (products.length > 0) {
      sumTotal = products.reduce(
        (sum: number, current) => sum + Number(current.price),
        0
      );
    }
    return sumTotal;
  }, [products]);

  return (
    <div className="order-resume-container">
      <div className="order-resume-header">
        <span>Resumen de Orden</span>
      </div>
      <div className="order-resume-item-container">
        {products.length > 0 &&
          products.map((product, index) => (
            <div className="order-resume-item" key={`${product.name}-${index}`}>
              <img
                className="order-resume-item-image"
                src={product.image}
                alt="Imagen-Producto"
                width={20}
                height={20}
              />
              <div className="order-resume-item-description">
                {product.name}
              </div>
              <span className="order-resume-item-price">
                ${Number(product.price).format(2, 0)}
              </span>
            </div>
          ))}
      </div>
      <div className="order-resume-button-container">
        <button className="btn btn-red">EDITAR</button>
      </div>
      <div className="order-resume-footer">
        <div className="order-resume-footer-item">
          <span>SUBTOTAL</span>
          <span>ENVÍO</span>
        </div>
        <div className="order-resume-footer-item">
          <span className="text-right"> ${Number(total).format(2, 0)}</span>
          <span>A calcular</span>
        </div>
      </div>
      <div className="order-resume-footer--second">
        <span className="order-resume-footer-item">TOTAL</span>
        <span className="order-resume-footer-item">
          ${Number(total).format(2, 0)}
        </span>
      </div>
    </div>
  );
};

export default OrderResume;
