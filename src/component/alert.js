import { h } from './element';
import { cssPrefix } from '../config';
import { t } from '../locale/locale';
import FormField from './form_field';
import { CellRange } from '../core/cell_range';

export default class Alert {
  constructor(viewFn, data) {
    this.viewFn = viewFn;
    this.data = data;
    this.el = h('div', `${cssPrefix}-alert`).hide();
    this.change = () => {};

    this.timer = null;
    this.ignoreNotificationIds = [];
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

  getFileAttrById(fileId, attr) {
    const files = this.data.settings.files;
    const found = files.find(f => f.id == fileId);
    return found ? found[attr] : '';
  }

  timerCb() {
    if (this.data) {
      const d = new Date();
      const now = `${this.pad(d.getHours(), 2)}:${this.pad(d.getMinutes(), 2)}:00`;
      console.log(now)
      this.data.notifications.every(n => {
        if (n.remind_time == now) {
          if (this.ignoreNotificationIds.indexOf(n.id) == -1) {
            this.render(n);
          }
          return false;
        } else {
          return true;
        }
      });
    }
  }

  startTimer() {
    if (this.timer == null) {
      this.timerCb();
      this.timer = setInterval(this.timerCb.bind(this), 30 * 1000);
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetData(data) {
    this.data = data;
    this.hide();

    if (this.data.settings.mode != 'edit') {
      this.startTimer();
    }
  }

  show() {
    this.el.show();
  }

  hide() {
    this.el.hide();
  }

  buildContent(notification) {
    const defaultTitle = notification.title ? notification.title : '';
    const titleField = new FormField(
      h('span').children(defaultTitle),
      { required: true },
      `${t('notification.title')}:`,
      40,
    );

    const downloadLink = h('a').children(this.getFileAttrById(notification.file_id, 'name'));
    downloadLink.attr('href', this.getFileAttrById(notification.file_id, 'url'));
    downloadLink.attr('target', '_blank');
    const downloadField = new FormField(
      downloadLink,
      { required: true },
      `${t('notification.program')}:`,
      40,
    );

    const colAndRow = h('span').children(this.getPosition(notification.col, notification.row));
    const position = new FormField(
      colAndRow,
      { required: true },
      `${t('notification.position')}:`,
      40,
    );

    const timeField = new FormField(
      h('span').children(notification.remind_time),
      { required: true },
      `${t('notification.remind_time')}:`,
      80,
    );

    return h('div', 'dialog-content').children('', titleField.el, downloadField.el, position.el, timeField.el);
  }

  render(notification) {
    const { el } = this;
    const view = this.viewFn();
    const dialog = h('div', 'dialog');
    const header = h('div', 'dialog-header')
    const title = h('span').html(t('alert.please_execute_program'));
    const closeButton = h('span', 'close-btn').html('X');
    closeButton.on('click', () => {
      this.ignoreNotificationIds.push(notification.id);
      this.hide();
    });
    header.children(title, closeButton);
    dialog.children(header);

    let content = this.buildContent(notification);
    dialog.children(content);

    // Put to parent.
    el.html('').children(dialog).show();
  }
}
