import Complete from '@firstandthird/complete';
import Domodule from 'domodule';
import { on } from 'domassist';

const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  DEL: 8
};

export default class Tokens extends Complete {
  preInit() {
    super.preInit();
    this.selectedTerm = [];
  }

  focus() {
    this.els.input.focus();
  }

  postInit() {
    super.postInit();

    if (this.options.initial) {
      this.options.initial.split(',').forEach(option => {
        const value = option.trim();
        this.selectedTerm.push({ value, name: value });
      });

      this.renderTokens();
    }

    on(this.el, 'token:add', this.onAddEvent.bind(this));
  }

  get defaults() {
    return {
      delay: 500,
      strict: true,
      showClass: 'show',
      inputName: 'tokens',
      highlightClass: 'selected'
    };
  }

  get required() {
    return {
      named: ['resultsContainer', 'tokensContainer', 'input']
    };
  }

  keydown(event) {
    super.keydown(event);

    switch (event.keyCode) {
      case KEYS.DEL: {
        if (!!this.els.input.value.trim()) {
          return;
        }
        this.selectedTerm.pop();
        this.renderTokens();
        break;
      }
      default:
        return;
    }

    event.preventDefault();
  }

  renderTokens() {
    let html = '';

    this.selectedTerm.forEach(o => {
      html += `<div class="token">
                  ${o.name} 
                  <span class="token-delete" data-action="removeToken" data-action-value="${o.value}">×</span>
                  <input type="hidden" name="${this.options.inputName}" value="${o.value}" />
                </div>`;
    });

    this.els.tokensContainer.innerHTML = html;
    this.setupActions();
  }

  updateValue(value) {
    if (!this.selectedTerm.some(o => o.value === value.value)) {
      this.els.input.value = '';
      this.addValue(value);
    }
  }

  getValue() {
    return this.selectedTerm.map(o => o.value);
  }

  addValue(value) {
    this.selectedTerm.push(value);
    this.renderTokens();
  }

  removeToken(el, event, data) {
    this.selectedTerm = this.selectedTerm.filter(o => o.value !== data.value);
    this.renderTokens();
  }

  onAddEvent(event) {
    const value = event.detail.value;

    if (value) {
      this.addValue({ name: value, value });
    }
  }
}

Domodule.register('Tokens', Tokens);
