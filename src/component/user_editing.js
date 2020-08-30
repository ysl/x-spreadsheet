import { h } from './element';
import { cssPrefix } from '../config';
import { t } from '../locale/locale';
import FormInput from './form_input';

export default class UserEditing {
  constructor(viewFn, data) {
    this.viewFn = viewFn;
    this.data = data;
    this.el = h('div', `${cssPrefix}-user_editing`).hide();
    this.change = () => {};
  }

  buildUserList() {
    const ri = this.data.selector.ri;
    const ci = this.data.selector.ci;
    const users = this.data.editingUsers.map(u => {
      const chk = new FormInput('', 'chk');
      chk.input.attr('type', 'checkbox');
      if (u.cells.findIndex(c => c.row == ri && c.col == ci && c.mode == 1) > 0) {
        chk.input.attr('checked', true);
      }
      chk.input.on('change', (e) => {
        let mode = e.target.checked ? 1 : 0;
        this.change(u.id, mode);
      });
      const userItem = h('span', 'user-name').children(`${u.name} - ${u.email}`);
      return h('div', 'user-item').children(chk.el, userItem);
    });

    const userList = h('div', 'user-list');
    if (users.length > 0) {
      userList.children(...users);
    }
    return userList;
  }

  resetData(data) {
    this.data = data;
    this.hide(); // When change sheet.
  }

  show() {
    this.el.show();
  }

  hide() {
    this.el.hide();
  }

  render() {
    const { el } = this;
    const view = this.viewFn();
    const dialog = h('div', 'dialog');
    const header = h('div', 'dialog-header')
    const title = h('span').html(t('userediting.allowCellEditing'));
    const closeButton = h('span', 'close-btn').html('X');
    closeButton.on('click', () => {
      this.hide();
    });
    header.children(title, closeButton);
    dialog.children(header);

    const userList = this.buildUserList();
    dialog.children(userList);

    // Put to parent.
    el.html('').children(dialog).show();
  }
}
