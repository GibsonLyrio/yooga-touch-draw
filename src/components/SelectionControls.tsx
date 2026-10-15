import { ELEMENTS } from "../editor/elements";
import { resizeElement, rotateElement } from "../editor/interactions";
import type { DrawingElement } from "../editor/types";
import { ElementShape } from "./ElementShape";
import { Icon } from "./Icon";

interface Props {
  element: DrawingElement | undefined;
  onChange: (element: DrawingElement) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function SelectionControls({ element, onChange, onDelete, onDuplicate }: Props) {
  const scale = element
    ? Math.round((element.width / ELEMENTS[element.type].width) * 100)
    : 100;
  return (
    <aside
      className="selection-controls panel"
      aria-label="Editar elemento selecionado"
    >
      <div className="panel-heading">
        <div className="heading-label">
          <Icon name="pointer" />
          <h2>Propriedades</h2>
        </div>
        <p>Ajuste cada detalhe do seu espaço.</p>
      </div>
      {element ? (
        <>
          <div className="selection-preview">
            <svg viewBox="-150 -85 300 170" aria-hidden="true">
              <ElementShape
                type={element.type}
                roomName={element.roomName}
                {...ELEMENTS[element.type]}
              />
            </svg>
            <strong className="selected-name">
              {element.type === "room"
                ? element.roomName?.trim() || ELEMENTS[element.type].label
                : ELEMENTS[element.type].label}
            </strong>
            <span className="selection-badge">
              <span />
              Selecionado
            </span>
          </div>
          {element.type !== "room" && <div className="property-section">
            <div className="property-label">
              <label htmlFor="element-size">Tamanho</label>
              <output htmlFor="element-size">{scale}%</output>
            </div>
            <input
              id="element-size"
              type="range"
              min="50"
              max="200"
              step="10"
              value={scale}
              aria-valuetext={`${scale}%`}
              onChange={(event) =>
                onChange(
                  resizeElement(element, Number(event.target.value) / 100),
                )
              }
            />
            <div className="range-labels" aria-hidden="true">
              <span>50%</span>
              <span>200%</span>
            </div>
          </div>}
          {element.type === "room" && (
            <div className="property-section room-name-control">
              <label htmlFor="room-name">Nome do cômodo</label>
              <input
                id="room-name"
                type="text"
                maxLength={40}
                value={element.roomName ?? ""}
                placeholder="Ex.: Salão"
                onChange={(event) =>
                  onChange({ ...element, roomName: event.target.value })
                }
              />
              <p className="field-help">O nome aparece no canto do cômodo.</p>
            </div>
          )}
          {element.type === "room" && (
            <div className="property-section dimensions-readout">
              <span>Dimensões</span>
              <strong>{Math.round(element.width)} × {Math.round(element.height)} px</strong>
              <p className="field-help">Arraste a alça no canto para ajustar largura e altura livremente.</p>
            </div>
          )}
          <div className="property-section rotation-control">
            <div className="property-label">
              <span>Rotação</span>
              <span className="rotation-value">{element.rotation}°</span>
            </div>
            <button
              onClick={() => onChange(rotateElement(element))}
              disabled={element.type === "round-table" || element.type === "room" || element.locked}
              aria-describedby={
                element.type === "round-table" || element.type === "room" ? "rotation-help" : undefined
              }
            >
              <Icon name="rotate" />
              Girar 45°
            </button>
            {(element.type === "round-table" || element.type === "room") && (
              <p className="field-help" id="rotation-help">
                {element.type === "room" ? "Cômodos permanecem alinhados à planta." : "Mesas redondas não precisam de rotação."}
              </p>
            )}
          </div>
          {element.type === "room" && (
            <div className="property-section lock-control">
              <div>
                <strong>Bloquear cômodo</strong>
                <p className="field-help">Impede movimentos e alterações de tamanho.</p>
              </div>
              <button
                className={element.locked ? "lock-button is-active" : "lock-button"}
                aria-pressed={element.locked}
                onClick={() => onChange({ ...element, locked: !element.locked })}
              >
                <Icon name={element.locked ? "lock" : "unlock"} />
                {element.locked ? "Bloqueado" : "Bloquear"}
              </button>
            </div>
          )}
          <div className="selection-actions">
            <button onClick={onDuplicate} title="Duplicar (Ctrl+C, Ctrl+V)">
              <Icon name="copy" />
              Duplicar elemento
            </button>
            <button className="danger" onClick={onDelete}>
              <Icon name="trash" />
              Excluir elemento
            </button>
          </div>
          <p className="keyboard-tip">
            No desenho, use as setas do teclado para mover o elemento.
          </p>
        </>
      ) : (
        <div className="selection-empty">
          <span className="empty-icon">
            <Icon name="pointer" size={28} />
          </span>
          <h3>Nenhum elemento selecionado</h3>
          <p>
            Selecione um item no desenho para ajustar o tamanho, girar ou
            excluir.
          </p>
        </div>
      )}
    </aside>
  );
}
