import Complete from '@firstandthird/complete';
import Domodule from 'domodule';
import { addClass, styles, on } from 'domassist';

const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  DEL: 8
};

export default class Tokens extends Complete {
  preInit() {
    super.preInit();
    const input = this.findOne('input');
    const computed = window.getComputedStyle(input);
    const template = `<li class="tokens-list-input-holder" data-name="inputHolder">
                          <input type="text" 
                                 autocomplete="off"
                                 autocapitalize="off"
                                 data-name="input"
                                 class="tokens-input-text"
                                 data-action="search" 
                                 data-action-type="input"
                                 placeholder="${input.placeholder}">
                          <tester data-name="inputResizer" style="position: absolute; top: -9999px; left: -9999px; width: auto; 
                                         font-size: ${computed.getPropertyValue('font-size')}; 
                                         font-family: ${computed.getPropertyValue('font-family')};
                                         font-weight: ${computed.getPropertyValue('font-weight')}; 
                                         letter-spacing: ${computed.getPropertyValue('letter-spacing')};">                                        
                          </tester>
                        </li>`;
    this.els.tokenList = document.createElement('ul');
    this.els.tokenList.innerHTML = template;
    this.els.tokenList.dataset.name = 'tokenList';
    this.selectedTerm = [];
    this.inputName = input.getAttribute('name');
    this.initialValue = input.value;

    addClass(this.els.tokenList, 'tokens-list');
    this.el.insertBefore(this.els.tokenList, input);
    input.remove();
  }

  focus() {
    this.els.input.focus();
  }

  postInit() {
    super.postInit();

    on(this.els.input, 'blur', this.resizeInput.bind(this));
    on(this.els.input, 'keyup', this.resizeInput.bind(this));
    on(this.els.input, 'keydown', this.resizeInput.bind(this));

    if (this.initialValue) {
      this.initialValue.split(',').forEach(value => {
        this.addValue({
          name: value.trim(),
          value: value.trim()
        });
      });
    }
  }

  resizeInput() {
    const value = this.els.input.value.trim() || this.els.input.placeholder;

    if (this.els.inputResizer.innerText !== value) {
      this.els.inputResizer.innerHTML = `<div>${value}</div>`;
      const width = `${this.els.inputResizer.offsetWidth + 30}px`;
      styles(this.els.input, { width });
    }
  }

  keydown(event) {
    super.keydown(event);

    switch (event.keyCode) {
      case KEYS.DEL: {
        if (!!this.els.input.value.trim()) {
          return;
        }
        const value = [...this.selectedTerm].pop();
        const el = this.findOne(`[data-action-value="${value.value}"]`);
        this.removeToken(el, event, value);
        break;
      }
      default:
        return;
    }

    event.preventDefault();
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
    const li = document.createElement('li');
    li.innerHTML = `<p>${value.name}</p> <span class="tokens-delete-token" data-action="removeToken" data-action-value="${value.value}">×</span>`;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = this.inputName;
    input.value = value.value;

    addClass(li, 'tokens-list-token');
    this.els.tokenList.insertBefore(li, this.els.inputHolder);
    this.el.appendChild(input);
    this.selectedTerm.push(value);

    this.setupActions();
  }

  removeToken(el, event, data) {
    el.parentNode.remove();
    this.selectedTerm = this.selectedTerm.filter(o => o.value !== data.value);
    this.findOne(`input[value="${data.value}"]`).remove();
  }
}

Domodule.register('Tokens', Tokens);
