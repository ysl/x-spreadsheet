import { h } from './element';
import { cssPrefix } from '../config';
import { t } from '../locale/locale';
import FormInput from './form_input';
import Moment from 'moment';

export default class TimeReport {
  constructor(viewFn, data) {
    this.viewFn = viewFn;
    this.data = data;
    this.el = h('div', `${cssPrefix}-time_report`).hide();
    this.change = () => {};
    this.updateReportedAt = () => Promise.resolve();
    this.tableRender = () => {};
  }

  /**
   * When operator click the cell, show the report window.
   */
  onCellSelected(cell, ri, ci) {
    const isEditingMode = this.data.settings.mode == 'edit';
    if (isEditingMode) {
      // Admin won't report.
      return;
    }

    // If user click the notification cell, show the sidebar.
    let found = this.data.timeReports.find((r) => {
      return (r.row == ri && r.col == ci);
    });
    if (found && found.reported_at == null) {
      let now = Moment().local().format('YYYY-MM-DD HH:mm:ss');
      let input = prompt(t('timereport.current_time') + ': ' + now + "\n" + t('timereport.please_enter_ok_to_report_time'));
      if (input && input.toLowerCase().trim() == 'ok') {
        this.updateReportedAt(found)
          .then((reports) => {
            // Overwrite the data.
            this.data.setTimeReports(reports);

            // Find the target report from the server response.
            let targetReport = reports.find((r) => {
              return (r.row == ri && r.col == ci);
            });

            // Update the cell value.
            if (targetReport) {
              const d = Moment.utc(targetReport.reported_at).local().format('YYYY-MM-DD HH:mm:ss');
              if (d) {
                this.data.rows.setCellText(ri, ci, d);
                // Refresh table.
                this.tableRender();
              }
            }

            alert(t('timereport.report_successfully'));
          });
      }
    }
  }

  buildUserList() {
    const selector = this.data.selector;
    let targetReport = null;

    // Find the targetReport by selected cell's col/row.
    for (let report of this.data.timeReports) {
      if (report.col == selector.ci && report.row == selector.ri) {
        targetReport = report;
      }
    }
    if (!targetReport) {
      targetReport = {
        col: selector.ci,
        row: selector.ri,
        user_id: null,
        reported_at: null
      }
      // Add it.
      this.data.timeReports.push(targetReport);
    }

    // Prepend a None option.
    let users = [{
      id: null,
      name: t('timereport.none'),
      email: null
    }];
    users = users.concat(this.data.settings.users);
    const userFields = users.map((u) => {
      const radio = new FormInput('', '');
      radio.input.attr('type', 'radio');
      radio.input.attr('name', 'user_id');
      if (u.id == targetReport.user_id) {
        radio.input.attr('checked', true);
      }
      radio.input.on('change', (e) => {
        if (e.target.checked) {
          targetReport.user_id = u.id;
        }

        // Notify server.
        this.change(targetReport);
      });
      const userItem = h('span', 'user-name').children(u.name + (u.email ? ` - ${u.email}` : ''));
      return h('div', 'user-item').children(radio.el, userItem);
    });
    const userList = h('div', 'user-list').children(...userFields);
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
    const title = h('span').html(t('timereport.set_time_report_user'));
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
