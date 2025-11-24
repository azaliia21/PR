export class Alerts {
    constructor(parent) {
        this.parent = parent;
        this.alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        this.init();
    }

    init() {
        const alertTrigger = document.getElementById('liveAlertBtn');
        if (alertTrigger) {
            alertTrigger.addEventListener('click', () => {
                this.alert('Отлично, вы запустили это предупреждающее сообщение!', 'success');
            });
        }
    }

    alert(message, type) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>',
            '</div>'
        ].join('');

        if (this.alertPlaceholder) {
            this.alertPlaceholder.append(wrapper);
        } else if (this.parent) {
            this.parent.append(wrapper);
        } else {
            console.warn('Alert placeholder not found');
        }
    }

    success(message) {
        this.alert(message, 'success');
    }

    error(message) {
        this.alert(message, 'danger');
    }

    warning(message) {
        this.alert(message, 'warning');
    }

    info(message) {
        this.alert(message, 'info');
    }

    clear() {
        if (this.alertPlaceholder) {
            this.alertPlaceholder.innerHTML = '';
        }
    }
}