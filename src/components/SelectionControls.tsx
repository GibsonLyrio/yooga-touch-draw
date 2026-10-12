import { ELEMENTS } from "../editor/elements";
import { resizeElement, rotateElement } from "../editor/interactions";
import type { DrawingElement } from "../editor/types";
import { ElementShape } from "./ElementShape";
import { Icon } from "./Icon";

interface Props {
  element: DrawingElement | undefined;
  onChange: (element: DrawingElement) => void;
  onDelete: () => void;
}

export function SelectionControls({ element, onChange, onDelete }: Props) {
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
              <ElementShape type={element.type} {...ELEMENTS[element.type]} />
            </svg>
            <strong className="selected-name">
              {ELEMENTS[element.type].label}
            </strong>
            <span className="selection-badge">
              <span />
              Selecionado
            </span>
          </div>
          <div className="property-section">
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
          </div>
          <div className="property-section rotation-control">
            <div className="property-label">
              <span>Rotação</span>
              <span className="rotation-value">{element.rotation}°</span>
            </div>
            <button
              onClick={() => onChange(rotateElement(element))}
              disabled={element.type === "round-table"}
              aria-describedby={
                element.type === "round-table" ? "rotation-help" : undefined
              }
            >
              <Icon name="rotate" />
              Girar 45°
            </button>
            {element.type === "round-table" && (
              <p className="field-help" id="rotation-help">
                Mesas redondas não precisam de rotação.
              </p>
            )}
          </div>
          <div className="selection-actions">
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
