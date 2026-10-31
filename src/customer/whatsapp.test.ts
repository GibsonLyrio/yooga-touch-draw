import { describe, expect, it } from "vitest";
import {
  formatWhatsapp,
  isValidWhatsapp,
  whatsappDigits,
} from "./whatsapp";

describe("identificação por WhatsApp", () => {
  it("aplica a máscara brasileira progressivamente", () => {
    expect(formatWhatsapp("1")).toBe("(1");
    expect(formatWhatsapp("1191234")).toBe("(11) 91234");
    expect(formatWhatsapp("11912345678")).toBe("(11) 91234-5678");
  });

  it("aceita colagem formatada e remove caracteres que não são números", () => {
    expect(formatWhatsapp("(11) 91234-5678")).toBe("(11) 91234-5678");
    expect(whatsappDigits("+55 abc (11) 91234-5678")).toBe("55119123456");
  });

  it("limita o valor aos 11 dígitos do celular com DDD", () => {
    expect(formatWhatsapp("119123456789999")).toBe("(11) 91234-5678");
    expect(whatsappDigits("119123456789999")).toHaveLength(11);
  });

  it("só considera completo um número com exatamente 11 dígitos", () => {
    expect(isValidWhatsapp("(11) 91234-567")).toBe(false);
    expect(isValidWhatsapp("(11) 91234-5678")).toBe(true);
  });
});
