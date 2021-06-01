import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { ContactModelApi } from "../../utils/models/contact.model";
import { getLocalities, register } from "../../utils/services/api";
import Checkbox from "../checkbox";
import InputGroup from "../input-group";
import Select from "../select";
import "./styles.scss";

const AdressContainer = () => {
  const [colonies, setColonies] = useState<Array<string>>([]);
  const [error, setError] = useState("");

  const {
    values: form,
    getProps,
    checkValidData,
    setValues: setForm,
    removeErrorField,
  } = useForm<ContactModelApi>({
    defaultValues: new ContactModelApi(),
    labels: {
      city: "",
      colony: "",
      code: "",
      email: "",
      lastName: "",
      name: "",
      state: "",
      street: "",
      telephone: "",
      town: "",
      policy: "",
    },
    validations: {
      city: {
        required: true,
      },
      colony: {
        required: true,
      },
      code: {
        required: true,
      },
      email: {
        required: true,
        pattern: {
          value:
            /(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
          message: "Email inválido",
        },
      },
      lastName: {
        required: true,
      },
      name: {
        required: true,
      },
      state: {
        required: true,
      },
      telephone: {
        required: true,
      },
      town: {
        required: true,
      },
      street: {
        required: true,
      },
      policy: {
        required: false,
      },
    },
  });

  useEffect(() => {
    if (Number(form.code) < 11000) {
      return;
    }
    const tout = setTimeout(async () => {
      try {
        const data = await getLocalities(form.code);
        if (!!data && data.city) {
          setForm((d) => ({
            ...d,
            city: data.city,
            town: data.town,
            state: data.state,
          }));
          setColonies(data.colonies);
        } else {
          setForm((d) => ({
            ...d,
            city: "",
            town: "",
            state: "",
          }));
          setColonies([]);
        }
        removeErrorField("All");
      } catch (error) {
        throw error;
      }
    }, 500);

    return () => tout && clearTimeout(tout);
  }, [form.code]);

  const handleSave = useCallback(() => {
    (async () => {
      try {
        setError("");
        if (checkValidData()) {
          const response = await register(form);
          if (!!response) {
            /**INSERTAR RESPUESTA */
          }
        }
      } catch (error) {
        setError("Hubo en error al mandar la información!");
        throw error;
      }
    })();
  }, [form]);

  return (
    <div className="address-container">
      <div className="address-header">
        <span>DIRECCIÓN DE ENVÍO</span>
      </div>
      <div className="form-container">
        <div className="form-row">
          <InputGroup
            {...getProps("name")}
            icon="fas fa-user fa-xs"
            placeholder="Nombres"
          />
          <InputGroup
            {...getProps("lastName")}
            icon="fas fa-user fa-xs"
            placeholder="Apellidos"
          />
        </div>
        <div className="form-row">
          <InputGroup
            {...getProps("telephone")}
            icon="fas fa-phone-alt fa-xs"
            placeholder="Número de Teléfono"
          />
          <InputGroup
            {...getProps("email")}
            icon="fas fa-envelope fa-xs"
            placeholder="Correo electrónico"
          />
        </div>
        <div className="form-row">
          <InputGroup
            type="number"
            min={11000}
            max={89000}
            {...getProps("code")}
            icon="fas fa-map-marker-alt"
            placeholder="Código Postal"
          />
          <Select
            {...getProps("colony")}
            icon="fas fa-map-marker-alt"
            placeholder="Colonia"
            disabled={!!colonies && colonies.length == 0}
            options={
              !!colonies
                ? colonies.map((col) => ({ label: col, value: col }))
                : []
            }
          />
        </div>
        <div className="form-row">
          <InputGroup
            {...getProps("state")}
            icon="fas fa-map-marker-alt"
            placeholder="Estado / Region"
            disabled
          />
          <InputGroup
            {...getProps("city")}
            icon="fas fa-map-marker-alt"
            placeholder="Ciudad"
            disabled
          />
        </div>
        <div className="form-row">
          <InputGroup
            {...getProps("town")}
            icon="fas fa-map-marker-alt"
            placeholder="Delegación o municipio"
            disabled
          />
          <InputGroup
            {...getProps("street")}
            icon="fas fa-map-marked-alt fa-xs"
            placeholder="Calle"
          />
        </div>
        <span className="error-text">{error}</span>
        <div className="form-footer">
          <button className="btn btn-black">Libreta de Direcciones</button>
          <button className="btn btn-black ml-2" onClick={handleSave}>
            Guardar
          </button>
        </div>
        <Checkbox
          id="factura"
          {...getProps("policy", "C")}
          label="Utilizar como dirección de facturación"
        />
      </div>
    </div>
  );
};

export default AdressContainer;
