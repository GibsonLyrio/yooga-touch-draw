import { ELEMENTS } from "../editor/elements";
import type { ElementType } from "../editor/types";
import { ElementShape } from "./ElementShape";
import { Icon } from "./Icon";

export function Toolbar({ onAdd }: { onAdd: (type: ElementType) => void }) {
  return (
    <aside className="library panel" aria-label="Adicionar elementos">
      <div className="panel-heading">
        <div className="heading-label">
          <Icon name="grid" />
          <h2>Elementos</h2>
        </div>
        <p>Escolha para adicionar ao ambiente.</p>
      </div>
      <div className="element-buttons">
        {(Object.keys(ELEMENTS) as ElementType[]).map((type) => (
          <button
            key={type}
            className="element-button"
            onClick={() => onAdd(type)}
            aria-label={`Adicionar ${ELEMENTS[type].label.toLowerCase()}`}
          >
            <span className={`element-preview preview-${type}`}>
              <svg viewBox="-150 -75 300 150" aria-hidden="true">
                <ElementShape type={type} {...ELEMENTS[type]} />
              </svg>
              <span className="add-mark">
                <Icon name="plus" size={16} />
              </span>
            </span>
            <span>{ELEMENTS[type].label}</span>
          </button>
        ))}
      </div>
      <div className="library-tip">
        <Icon name="info" size={18} />
        <p>
          Adicione quantos elementos precisar. Depois, arraste para organizar.
        </p>
      </div>
    </aside>
  );
}
