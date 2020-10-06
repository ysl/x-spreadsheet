import { h } from './element';
import { cssPrefix } from '../config';
import { t } from '../locale/locale';
import FormInput from './form_input';

const CHECKBOX_UNCHECKED = 0;
const CHECKBOX_CHECKED = 1;
const CHECKBOX_PARTIAL_CHECKED = 2;

export default class UserEditing {
  constructor(viewFn, data) {
    this.viewFn = viewFn;
    this.data = data;
    this.el = h('div', `${cssPrefix}-user_editing`).hide();
    this.change = () => {};
  }

  buildUserList() {
    const range = this.data.selector.range;
    const users = this.data.editingUsers.map(u => {
      const chk = new FormInput('', 'chk');
      chk.input.attr('type', 'checkbox');

      const status = this.getCheckboxStatus(range, u.cells);
      switch (status) {
        case CHECKBOX_CHECKED:
          chk.input.attr('checked', true);
          break;
        case CHECKBOX_PARTIAL_CHECKED:
          chk.input.el.indeterminate = true;
          break;
        default:
          // Unchecked.
          break;
      }

      chk.input.on('change', (e) => {
        let checked = e.target.checked ? true : false;

        // According the checked state to add/remove the cells of range.
        if (checked) {
          u.cells = this.addRangeToUserCell(range, u.cells);
        } else {
          u.cells = this.minusRangeOfUserCell(range, u.cells);
        }

        this.change(u);
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

  /**
   * Return the checkbox status:
   * @return integer
   *   0: unchecked
   *   1: checked
   *   2: half-checked
   */
  getCheckboxStatus(range, userCells) {
    let hasMached = false;
    let hasNotMatched = false;

    // Note: col, row are starting from 0.
    let rangeCells = this.rangeToCells(range);
    rangeCells.forEach((rCell) => { // Loop for all cell in the range
      userCells.forEach((uCell) => { // Check all cell of user
        if (rCell.col == uCell.col && rCell.row == uCell.row) {
          hasMached = true;
        } else {
          hasNotMatched = true;
        }
      });
    });

    if (rangeCells.length == 1) {
      if (hasMached) {
        return CHECKBOX_CHECKED;
      } else {
        return CHECKBOX_UNCHECKED;
      }
    } else {
      if (hasMached && !hasNotMatched) {
        return CHECKBOX_CHECKED; // Full mached
      } else if (hasMached && hasNotMatched) {
        return CHECKBOX_PARTIAL_CHECKED; // Partial matched
      } else {
        return CHECKBOX_UNCHECKED; // No matched.
      }
    }
  }

  /**
   * Convert the range to cells.
   */
  rangeToCells(range) {
    let arr = [];
    range.each((i, j) => {
      arr.push({
        col: j,
        row: i,
        mode: 1
      });
    });
    return arr;
  }

  addRangeToUserCell(range, userCells) {
    userCells = this.minusRangeOfUserCell(range, userCells);
    userCells = userCells.concat(this.rangeToCells(range));
    return userCells;
  }

  minusRangeOfUserCell(range, userCells) {
    let rangeCells = this.rangeToCells(range);
    userCells = userCells.filter((uCell) => {
      let notFound = rangeCells.every((rCell) => {
        if (rCell.col == uCell.col && rCell.row == uCell.row) {
          return false;
        } else {
          return true;
        }
      })
      return notFound;
    });
    return userCells;
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
