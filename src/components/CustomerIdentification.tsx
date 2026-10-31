import { useState, type FormEvent } from "react";
import yoogaSymbol from "../assets/yooga-symbol.png";
import { formatWhatsapp, isValidWhatsapp } from "../customer/whatsapp";

interface Props {
  onContinue: (whatsapp: string) => void;
}

export function CustomerIdentification({ onContinue }: Props) {
  const [whatsapp, setWhatsapp] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = isValidWhatsapp(whatsapp);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (valid) onContinue(whatsapp);
  }

  return (
    <main className="identification-page">
      <section className="identification-card" aria-labelledby="identification-title">
        <div className="identification-brand" aria-label="Yooga Touch Draw">
          <img src={yoogaSymbol} alt="" width="36" height="48" />
          <span className="brand-word">yooga</span>
          <span className="brand-divider" />
          <span className="product-name">Touch Draw</span>
        </div>
        <p className="eyebrow">Antes de começar</p>
        <h1 id="identification-title">Identifique-se para criar seu ambiente</h1>
        <p className="identification-description">
          Informe seu WhatsApp para acessar o editor e transformar sua ideia em um desenho.
        </p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="customer-whatsapp">Número de WhatsApp</label>
          <input
            id="customer-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="(11) 91234-5678"
            value={whatsapp}
            maxLength={15}
            autoFocus
            aria-describedby="whatsapp-help whatsapp-error"
            aria-invalid={touched && !valid}
            onBlur={() => setTouched(true)}
            onChange={(event) => setWhatsapp(formatWhatsapp(event.target.value))}
          />
          <p id="whatsapp-help" className="field-help">
            Use o DDD e os 9 dígitos do celular.
          </p>
          <p id="whatsapp-error" className="field-error" aria-live="polite">
            {touched && !valid ? "Digite um número completo com DDD." : ""}
          </p>
          <button className="primary identification-submit" type="submit" disabled={!valid}>
            Começar meu desenho
          </button>
        </form>
      </section>
    </main>
  );
}
