import { useEffect, useRef, useState } from "react";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { SelectionControls } from "./components/SelectionControls";
import { Toolbar } from "./components/Toolbar";
import { Dialog } from "./components/Dialog";
import { Icon } from "./components/Icon";
import { createElement, duplicateElement, ELEMENTS } from "./editor/elements";
import { exportPng } from "./editor/export";
import { recordSnapshot, redoSnapshot, undoSnapshot } from "./editor/history";
import { resolveEditorShortcut } from "./editor/shortcuts";
import type { DrawingElement, ElementType } from "./editor/types";
import yoogaSymbol from "./assets/yooga-symbol.png";

export default function App() {
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [past, setPast] = useState<DrawingElement[][]>([]);
  const [future, setFuture] = useState<DrawingElement[][]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", error: false });
  const [dialog, setDialog] = useState<"clear" | "help" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const elementsRef = useRef(elements);
  const pastRef = useRef(past);
  const futureRef = useRef(future);
  const transactionRef = useRef<DrawingElement[] | null>(null);
  const clipboardRef = useRef<DrawingElement | null>(null);
  const selected = selectedIds.length === 1
    ? elements.find((element) => element.id === selectedIds[0])
    : undefined;

  function announce(text: string, error = false) {
    setFeedback({ text, error });
  }
  function replaceElements(next: DrawingElement[], record = true) {
    const current = elementsRef.current;
    if (next === current) return;
    if (record) {
      const nextPast = recordSnapshot(pastRef.current, current);
      pastRef.current = nextPast;
      futureRef.current = [];
      setPast(nextPast);
      setFuture([]);
    }
    elementsRef.current = next;
    setElements(next);
  }
  function undo() {
    const transition = undoSnapshot(pastRef.current, elementsRef.current, futureRef.current);
    if (!transition) return;
    pastRef.current = transition.past;
    futureRef.current = transition.future;
    setPast(transition.past);
    setFuture(transition.future);
    replaceElements(transition.present, false);
    announce("Última ação desfeita.");
  }
  function redo() {
    const transition = redoSnapshot(pastRef.current, elementsRef.current, futureRef.current);
    if (!transition) return;
    pastRef.current = transition.past;
    futureRef.current = transition.future;
    setPast(transition.past);
    setFuture(transition.future);
    replaceElements(transition.present, false);
    announce("Ação refeita.");
  }
  function startInteraction() {
    transactionRef.current ??= elementsRef.current;
  }
  function endInteraction() {
    const before = transactionRef.current;
    transactionRef.current = null;
    if (!before || before === elementsRef.current) return;
    const nextPast = recordSnapshot(pastRef.current, before);
    pastRef.current = nextPast;
    futureRef.current = [];
    setPast(nextPast);
    setFuture([]);
  }
  function add(type: ElementType) {
    const element = createElement(type, elements);
    replaceElements(type === "room" ? [element, ...elementsRef.current] : [...elementsRef.current, element]);
    setSelectedIds([element.id]);
    announce(`${ELEMENTS[type].label} adicionada.`);
  }
  function update(element: DrawingElement) {
    const next = elementsRef.current.map((item) => (item.id === element.id ? element : item));
    replaceElements(next, transactionRef.current === null);
  }
  function removeSelected() {
    replaceElements(elementsRef.current.filter((element) => !selectedIds.includes(element.id)));
    setSelectedIds([]);
    announce("Elemento excluído.");
    // The delete button leaves the DOM; return keyboard users to the drawing.
    svgRef.current?.focus();
  }
  function clear() {
    replaceElements([]);
    setSelectedIds([]);
    setDialog(null);
    requestAnimationFrame(() => svgRef.current?.focus());
    announce("Desenho limpo. Seu espaço está pronto para uma nova ideia.");
  }
  function copySelected() {
    const source = elementsRef.current.find((element) => element.id === selectedIds[0]);
    if (!source) return;
    clipboardRef.current = { ...source };
    announce("Elemento copiado. Use Ctrl+V para colar.");
  }
  function pasteCopied() {
    if (!clipboardRef.current) return;
    const copy = duplicateElement(clipboardRef.current, elementsRef.current);
    replaceElements([...elementsRef.current, copy]);
    setSelectedIds([copy.id]);
    announce(`${ELEMENTS[copy.type].label} duplicado.`);
  }
  function duplicateSelected() {
    copySelected();
    pasteCopied();
  }

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => elements.some((element) => element.id === id)));
  }, [elements]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const shortcut = resolveEditorShortcut(
        event,
        Boolean(target?.matches("input, textarea, [contenteditable='true']")),
      );
      if (shortcut === "undo" || shortcut === "redo") {
        event.preventDefault();
        if (shortcut === "redo") redo(); else undo();
      } else if (shortcut === "copy" && selectedIds.length === 1) {
        event.preventDefault();
        copySelected();
      } else if (shortcut === "paste" && clipboardRef.current) {
        event.preventDefault();
        pasteCopied();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });
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
            <div className="history-actions" aria-label="Histórico de edição">
              <button onClick={undo} disabled={past.length === 0} aria-label="Desfazer" title="Desfazer (Ctrl+Z)">
                <Icon name="undo" />
              </button>
              <button onClick={redo} disabled={future.length === 0} aria-label="Refazer" title="Refazer (Ctrl+Shift+Z)">
                <Icon name="redo" />
              </button>
            </div>
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
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
              onChange={update}
              onInteractionStart={startInteraction}
              onInteractionEnd={endInteraction}
              svgRef={svgRef}
            />
            <div className="canvas-footer">
              <span>
                <Icon name="pointer" size={16} />
                Arraste no fundo para selecionar vários elementos
              </span>
              <span>1200 × 800 px</span>
            </div>
            <p id="canvas-keyboard-help" className="sr-only">
              Arraste uma área vazia do desenho para selecionar vários elementos.
              Use Tab para acessar os elementos. Enter ou Espaço seleciona. As setas
              movem 10 pixels; Shift e seta movem 1 pixel. Escape desfaz a seleção.
              Ctrl+Z desfaz, Ctrl+Shift+Z refaz e Ctrl+C/Ctrl+V duplica.
            </p>
          </section>
          <SelectionControls
            element={selected}
            selectedCount={selectedIds.length}
            onChange={update}
            onDelete={removeSelected}
            onDuplicate={duplicateSelected}
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
            . Você ainda poderá desfazer essa ação pelo histórico.
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
            <p>Escolha cômodos, móveis e itens operacionais na biblioteca.</p>
          </li>
          <li>
            <strong>Organize o ambiente</strong>
            <p>Arraste os itens para organizar ou arraste no fundo para selecionar vários. Use a alça no canto para redimensionar.</p>
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
            seleção. Ctrl+Z desfaz, Ctrl+Shift+Z refaz e Ctrl+C/Ctrl+V duplica.
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
