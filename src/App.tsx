import { useRef, useState } from "react";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { SelectionControls } from "./components/SelectionControls";
import { Toolbar } from "./components/Toolbar";
import { Dialog } from "./components/Dialog";
import { Icon } from "./components/Icon";
import { createElement, ELEMENTS } from "./editor/elements";
import { exportPng } from "./editor/export";
import type { DrawingElement, ElementType } from "./editor/types";
import yoogaSymbol from "./assets/yooga-symbol.png";

export default function App() {
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", error: false });
  const [dialog, setDialog] = useState<"clear" | "help" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const selected = elements.find((element) => element.id === selectedId);

  function announce(text: string, error = false) {
    setFeedback({ text, error });
  }
  function add(type: ElementType) {
    const element = createElement(type, elements);
    setElements((current) => [...current, element]);
    setSelectedId(element.id);
    announce(`${ELEMENTS[type].label} adicionada.`);
  }
  function update(element: DrawingElement) {
    setElements((current) =>
      current.map((item) => (item.id === element.id ? element : item)),
    );
  }
  function removeSelected() {
    setElements((current) =>
      current.filter((element) => element.id !== selectedId),
    );
    setSelectedId(null);
    announce("Elemento excluído.");
    // The delete button leaves the DOM; return keyboard users to the drawing.
    svgRef.current?.focus();
  }
  function clear() {
    setElements([]);
    setSelectedId(null);
    setDialog(null);
    requestAnimationFrame(() => svgRef.current?.focus());
    announce("Desenho limpo. Seu espaço está pronto para uma nova ideia.");
  }
  async function download() {
    if (!svgRef.current || exporting) return;
    setExporting(true);
    announce("Preparando seu PNG…");
    try {
      await exportPng(svgRef.current);
      announce("PNG pronto. Download iniciado.");
    } catch {
      announce(
        "Não foi possível exportar a imagem. Seu desenho foi preservado. Tente novamente.",
        true,
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="app">
      <a className="skip-link" href="#workspace">
        Ir para o editor
      </a>
      <header className="app-header">
        <div className="brand" aria-label="Yooga Touch Draw">
          <img src={yoogaSymbol} alt="" width="27" height="36" />
          <span className="brand-word">yooga</span>
          <span className="brand-divider" />
          <span className="product-name">Touch Draw</span>
        </div>
        <button className="quiet help-button" onClick={() => setDialog("help")}>
          <Icon name="help" />
          Como usar
        </button>
      </header>
      <main className="main-content" id="workspace" tabIndex={-1}>
        <div className="page-heading">
          <div>
            <p className="eyebrow">Seu espaço, do seu jeito</p>
            <h1>Editor de ambientes</h1>
            <p className="page-description">
              Transforme suas ideias em um espaço bem organizado.
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setDialog("clear")}
              disabled={elements.length === 0}
            >
              <Icon name="trash" />
              Limpar desenho
            </button>
            <button
              className="primary"
              onClick={() => void download()}
              disabled={exporting}
              aria-busy={exporting}
            >
              {exporting ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <Icon name="download" />
              )}
              {exporting ? "Exportando…" : "Exportar PNG"}
            </button>
          </div>
        </div>
        <div className="workspace">
          <Toolbar onAdd={add} />
          <section className="editor panel" aria-label="Editor de ambientes">
            <div className="canvas-heading">
              <div className="heading-label">
                <Icon name="layout" />
                <h2>Meu ambiente</h2>
              </div>
              <span className="element-count">
                {elements.length}{" "}
                {elements.length === 1 ? "elemento" : "elementos"}
              </span>
            </div>
            <DrawingCanvas
              elements={elements}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={update}
              svgRef={svgRef}
            />
            <div className="canvas-footer">
              <span>
                <Icon name="pointer" size={16} />
                Selecione e arraste para organizar
              </span>
              <span>1200 × 800 px</span>
            </div>
            <p id="canvas-keyboard-help" className="sr-only">
              Use Tab para acessar os elementos. Enter ou Espaço seleciona. As
              setas movem 10 pixels; Shift e seta movem 1 pixel. Escape desfaz a
              seleção.
            </p>
          </section>
          <SelectionControls
            element={selected}
            onChange={update}
            onDelete={removeSelected}
          />
        </div>
        <div
          className={`feedback ${feedback.error ? "feedback-error" : ""}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {feedback.text && (
            <>
              <Icon
                name={feedback.error ? "warning" : exporting ? "info" : "check"}
                size={18}
              />
              <span>{feedback.text}</span>
            </>
          )}
        </div>
        <footer className="app-footer">
          <Icon name="info" size={16} />
          <p>Seu desenho fica apenas nesta sessão. Exporte antes de sair.</p>
          <span>Feito para dar espaço às suas ideias.</span>
        </footer>
      </main>
      <Dialog
        open={dialog === "clear"}
        title="Limpar o desenho?"
        id="clear"
        onClose={() => setDialog(null)}
      >
        <div className="dialog-message">
          <span className="warning-icon">
            <Icon name="trash" size={26} />
          </span>
          <p>
            {elements.length === 1
              ? "O elemento será removido"
              : `Todos os ${elements.length} elementos serão removidos`}
            . Esta ação não pode ser desfeita.
          </p>
          <p className="field-help">
            Se quiser guardar o ambiente, cancele e exporte uma imagem antes.
          </p>
        </div>
        <div className="dialog-actions">
          <button data-dialog-initial-focus onClick={() => setDialog(null)}>
            Cancelar
          </button>
          <button className="destructive" onClick={clear}>
            Limpar desenho
          </button>
        </div>
      </Dialog>
      <Dialog
        open={dialog === "help"}
        title="Um espaço para suas ideias"
        id="help"
        onClose={() => setDialog(null)}
      >
        <ol className="help-steps">
          <li>
            <strong>Adicione os elementos</strong>
            <p>Escolha mesas, cadeiras e paredes na biblioteca.</p>
          </li>
          <li>
            <strong>Organize o ambiente</strong>
            <p>Arraste os itens e ajuste tamanho e rotação em Propriedades.</p>
          </li>
          <li>
            <strong>Leve sua ideia com você</strong>
            <p>
              Exporte um PNG. A imagem inclui somente o desenho, sem a grade e
              os controles.
            </p>
          </li>
        </ol>
        <div className="keyboard-guide">
          <Icon name="info" />
          <p>
            Pelo teclado: Tab acessa os elementos; Enter seleciona; as setas
            movem. Use Shift + seta para um ajuste fino e Escape para desfazer a
            seleção.
          </p>
        </div>
        <div className="dialog-actions">
          <button className="primary" data-dialog-initial-focus onClick={() => setDialog(null)}>
            Entendi
          </button>
        </div>
      </Dialog>
    </div>
  );
}
