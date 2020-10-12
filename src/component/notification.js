import { h } from './element';
import { cssPrefix } from '../config';
import { t } from '../locale/locale';
import FormField from './form_field';
import FormInput from './form_input';
import FormSelect from './form_select';
import Button from './button';
import { CellRange } from '../core/cell_range';

export default class Notification {
  constructor(viewFn, data) {
    this.viewFn = viewFn;
    this.data = data;
    this.el = h('div', `${cssPrefix}-notification`).hide();
    this.showCreateForm = false;
    this.tmpNotification = null;

    // Export for overwrite.
    this.createFn = () => Promise.resolve();
    this.updateFn = () => Promise.resolve();
    this.removeFn = () => Promise.resolve();
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getPosition(ci, ri) {
    if (isNaN(ci) || isNaN(ri)) {
      return '';
    }
    let r = new CellRange(ri, ci, ri, ci);
    return r.toString();
  }

  setTimeString(time, hour=null, minute=null) {
    if (!time) {
      time = '00:00:00';
    }
    let arr = time.split(':');
    if (hour !== null) {
      arr[0] = hour;
    } else if (minute !== null) {
      arr[1] = minute;
    }
    return `${arr[0]}:${arr[1]}:00`;
  }

  setUserIds(userIds, targetId, checked) {
    if (checked) {
      userIds.push(targetId);
    } else {
      let index = userIds.indexOf(targetId);
      if (index > -1) {
        userIds.splice(index, 1);
      }
    }
    return userIds;
  }

  getFilenameById(fileId) {
    const files = this.data.settings.files;
    const found = files.find(f => f.id == fileId);
    return found ? found.name : '-';
  }

  getTimePart(time, isHour=true) {
    if (time) {
      let arr = time.split(':');
      if (arr.length >= 3) {
        if (isHour) {
          return arr[0];
        } else { // Minute
          return arr[1];
        }
      }
    }

    // For invalid format.
    return '00';
  }

  onCellSelected(cell, ri, ci) {
    // If user click the notification cell, show the sidebar.
    let found = this.data.notifications.find((n) => {
      return (n.row == ri && n.col == ci);
    });
    if (found) {
      return this.render();
    }

    if (this.isShow()) {
      return this.render();
    }
  }

  onNotificationUpdate(n, data) {
    let o = Object.assign(n, data);
    if (n.id) {
      this.updateFn(o)
        .then((notifications) => {
          // Overwrite the data.
          this.data.notifications = notifications;
          this.render();
        });
    } else {
      this.tmpNotification = o;
    }
  }

  buildCard(n, isNew=false) {
    const note = h('div', 'title').children(isNew ? t('notification.create_new_notificaiton') : '');

    const defaultTitle = n.title ? n.title : '';
    const input = new FormInput('100%', '');
    input.val(defaultTitle);
    input.input.on('change', ({ target }) => {
      this.onNotificationUpdate(n, { title: target.value });
    });
    const titleField = new FormField(
      input,
      { required: true },
      `${t('notification.title')}:`,
      60,
    );

    const files = this.data.settings.files;
    const defaultFilename = this.getFilenameById(n.file_id);
    const fileList = new FormField(
      new FormSelect(defaultFilename,
        files,
        '100%',
        file => typeof file == 'object' ? file.name : file,
        file => { this.onNotificationUpdate(n, { file_id: file.id }) }
      ),
      { required: true },
      `${t('notification.file')}:`,
      60,
    );

    const colAndRow = h('span').children(this.getPosition(n.col, n.row));
    const position = new FormField(
      colAndRow,
      { required: true },
      `${t('notification.position')}:`,
      60,
    );
    const defaultHour = this.getTimePart(n.remind_at, true);
    const hour = new FormSelect(defaultHour,
      Array.from(Array(24).keys()).map(i => this.pad(i, 2)),
      '100%',
      h => h,
      h => { this.onNotificationUpdate(n, { remind_at: this.setTimeString(n.remind_at, h)}) }
    );

    const defaultMinute = this.getTimePart(n.remind_at, false);
    const minute = new FormSelect(defaultMinute,
      Array.from(Array(60).keys()).map(i => this.pad(i, 2)),
      '100%',
      m => m,
      m => { this.onNotificationUpdate(n, { remind_at: this.setTimeString(n.remind_at, null, m)}) }
    );
    const time = h('span').children(hour.el, ':', minute.el);
    const timeField = new FormField(
      time,
      { required: true },
      `${t('notification.remind_at')}:`,
      60,
    );

    const users = this.data.settings.users;
    const userFields = users.map((u) => {
      const chk = new FormInput('', 'chk');
      chk.input.attr('type', 'checkbox');
      if (n.user_ids.indexOf(u.id) > -1) {
        chk.input.attr('checked', true);
      }
      chk.input.on('change', (e) => {
        let newList = [];
        if (e.target.checked) {
          newList = this.setUserIds(n.user_ids, u.id, true);
        } else {
          newList = this.setUserIds(n.user_ids, u.id, false);
        }
        this.onNotificationUpdate(n, { user_ids: newList });
      });
      const userItem = h('span', 'user-name').children(`${u.name} - ${u.email}`);
      return h('div', 'user-item').children(chk.el, userItem);
    });
    const userList = h('div', 'user-list').children(t('notification.remind_user')+':', ...userFields);

    const buttons = [];
    if (isNew) {
      const confirmBtn = new Button('ok', 'ok').on('click', () => {
        // Validation.
        if (!this.tmpNotification.file_id) {
          return alert(t('notification.please_select_a_file'));
        }
        if (this.tmpNotification.user_ids.length == 0) {
          return alert(t('notification.at_least_one_user'));
        }

        this.createFn(this.tmpNotification)
          .then(() => {
            this.showCreateForm = false;
            this.render();
          });
      });
      const cancelBtn = new Button('cancel', 'cancel').on('click', () => {
        this.showCreateForm = false;
        this.render();
      });
      buttons.push(confirmBtn);
      buttons.push(cancelBtn);
    } else {
      const removeBtn = new Button('remove', 'remove').on('click', () => {
        let r = confirm(t('notification.confirm_to_remove'))
        if (r !== true) {
            return;
        }

        this.removeFn(n)
          .then(() => {
            this.render();
          });
      });
      buttons.push(removeBtn);
    }
    const actions = h('div', 'actions').children(...buttons);

    return h('div', `card ${isNew ? 'new-card' : ''}`).children(note, titleField.el, position.el, fileList.el, timeField.el, userList.el, actions.el);
  }

  buildCreateForm() {
    const selector = this.data.selector;
    this.tmpNotification = {
      title: '',
      col: selector.ci,
      row: selector.ri,
      remind_at: '00:00:00',
      file_id: null,
      user_ids: [],
    }
    const card = this.buildCard(this.tmpNotification, true);
    const form = h('div', 'new-card').children(card);
    if (!this.showCreateForm) {
      form.hide();
    }
    return form;
  }

  buildList() {
    const nofifications = this.data.notifications.map(n => {
      return this.buildCard(n);
    });

    const list = h('div', 'card-list');
    if (nofifications.length > 0) {
      list.children(...nofifications);
    }
    return list;
  }

  resetData(data, sheet) {
    this.data = data;
    // sheet.on('cell-selected', this.onCellSelected)
    this.hide(); // When change sheet.
  }

  show() {
    this.el.show();
  }

  hide() {
    this.el.hide();
  }

  isShow() {
    return this.el.css('display') == 'block';
  }

  render() {
    const { el } = this;
    const view = this.viewFn();
    const sidebar = h('div', 'sidebar');
    const header = h('div', 'sidebar-header')
    const title = h('span', 'title').html(t('contextmenu.notification'));
    const createBtn = new Button('create', 'create').on('click', () => {
      this.showCreateForm = true;
      this.render();
    });
    const closeButton = h('span', 'close-btn').html('X');
    closeButton.on('click', () => {
      this.hide();
    });


    header.children(title, (this.showCreateForm ? '' : createBtn), closeButton);
    sidebar.children(header);

    const createForm = this.buildCreateForm();
    const list = this.buildList();
    sidebar.children(createForm, list);

    // Put to parent.
    el.html('').children(sidebar).show();
  }
}
