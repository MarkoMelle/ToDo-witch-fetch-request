/* eslint-disable no-param-reassign */

export default class AppController {
  constructor(ApiController, app) {
    this.api = ApiController;
    this.app = app;

    this.ticketsListDOM = this.app.querySelector('.tickets-list');
    this.editFormDOM = document.querySelector('.edit-form');
    this.editFormSubmitDOM = this.editFormDOM.querySelector('.edit-btn');
    this.editFormCloseDOM = this.editFormDOM.querySelector('.close-btn');

    this.addFormDOM = document.querySelector('.add-form');
    this.addFormBtn = document.querySelector('.add-ticket');
    this.addFormSubmitDOM = this.addFormDOM.querySelector('.add-btn');
    this.addFormCloseDOM = this.addFormDOM.querySelector('.close-btn');

    this.tickets = [];
  }

  async init() {
    this.#renderTickets(await this.api.getAllTickets());
    this.tickets.forEach((ticket) => { this.addEventListeners(ticket.DOM); });
    this.editFormSubmitDOM.onclick = this.editFormSubmit.bind(this);
    this.editFormCloseDOM.onclick = this.editFormClose.bind(this);
    this.addFormBtn.onclick = this.addFormOpen.bind(this);
    this.addFormSubmitDOM.onclick = this.addFormSubmit.bind(this);
    this.addFormCloseDOM.onclick = this.addFormClose.bind(this);
  }

  // edit form start
  async editFormOpen(e) {
    const id = e.target.parentElement.dataset.id;
    const ticketFull = await this.api.ticketById(id);
    const nameField = AppController.getNameField(this.editFormDOM);
    const descriptionField = AppController.getDescriptionField(this.editFormDOM);
    nameField.value = ticketFull.name;
    descriptionField.value = ticketFull.description;
    this.editFormDOM.classList.remove('hidden');
    this.editFormDOM.classList.add('slide-in-top');
    this.editFormDOM.dataset.id = id;
    this.app.classList.add('blur');
    this.addFormBtn.classList.add('blur');
    nameField.focus();
  }

  async editFormSubmit(e) {
    e.preventDefault();
    const id = this.editFormDOM.dataset.id;
    const nameField = AppController.getNameField(this.editFormDOM);
    const descriptionField = AppController.getDescriptionField(this.editFormDOM);
    if (nameField.value === '') {
      nameField.classList.add('input--invalid');
      nameField.placeholder = 'Не может быть пустым';
      nameField.focus();
      AppController.checkNameField(nameField);
      return;
    }
    nameField.classList.remove('input--invalid');
    nameField.removeAttribute('placeholder');
    this.#renderTickets(await this.api.editTicket(
      id,
      nameField.value.trim(),
      descriptionField.value.trim(),
    ));
    this.editFormDOM.removeAttribute('data-id');
    this.editFormDOM.classList.add('hidden');
    this.editFormDOM.classList.remove('slide-in-top');
    this.app.classList.remove('blur');
    this.addFormBtn.classList.remove('blur');
    this.tickets.forEach((ticket) => { this.addEventListeners(ticket.DOM); });
  }

  editFormClose(e) {
    e.preventDefault();
    const nameField = AppController.getNameField(this.editFormDOM);
    this.editFormDOM.removeAttribute('data-id');
    this.editFormDOM.classList.add('hidden');
    this.editFormDOM.classList.remove('slide-in-top');
    this.app.classList.remove('blur');
    this.addFormBtn.classList.remove('blur');
    nameField.classList.remove('input--invalid');
    nameField.removeAttribute('placeholder');
  }

  // Add form start

  addFormOpen(e) {
    e.preventDefault();
    const nameField = AppController.getNameField(this.addFormDOM);
    this.addFormDOM.classList.remove('hidden');
    this.addFormDOM.classList.add('slide-in-top');
    nameField.focus();
  }

  async addFormSubmit(e) {
    e.preventDefault();
    const nameField = AppController.getNameField(this.addFormDOM);
    const descriptionField = AppController.getDescriptionField(this.addFormDOM);
    if (nameField.value === '') {
      nameField.classList.add('input--invalid');
      nameField.placeholder = 'Не может быть пустым';
      nameField.focus();
      AppController.checkNameField(nameField);
      return;
    }
    nameField.classList.remove('input--invalid');
    nameField.removeAttribute('placeholder');
    this.#renderTickets(await this.api.createTicket(
      nameField.value.trim(),
      descriptionField.value.trim(),
    ));
    descriptionField.value = '';
    nameField.value = '';
    this.addFormDOM.classList.add('hidden');
    this.addFormDOM.classList.remove('slide-in-top');
    this.app.classList.remove('blur');
    this.addFormBtn.classList.remove('blur');
    this.tickets.forEach((ticket) => { this.addEventListeners(ticket.DOM); });
  }

  addFormClose(e) {
    e.preventDefault();
    const nameField = AppController.getNameField(this.addFormDOM);
    const descriptionField = AppController.getDescriptionField(this.addFormDOM);
    this.addFormDOM.classList.add('hidden');
    this.addFormDOM.classList.remove('slide-in-top');
    this.app.classList.remove('blur');
    this.addFormBtn.classList.remove('blur');
    descriptionField.value = '';
    nameField.value = '';
    nameField.classList.remove('input--invalid');
    nameField.removeAttribute('placeholder');
  }

  // Add form end

  async openTicketFull(e) {
    e.preventDefault();
    if (e.target.closest('button')) {
      return;
    }
    const ticketDOM = e.target.closest('.ticket');
    const descriptionDOM = ticketDOM.querySelector('.ticket__description');
    if (!descriptionDOM.classList.contains('hidden')) {
      descriptionDOM.classList.add('hidden');
      return;
    }
    const id = ticketDOM.dataset.id;
    if (!ticketDOM.dataset.isFullLoaded) {
      const ticket = await this.api.ticketById(id);
      descriptionDOM.textContent = ticket.description;
      ticketDOM.dataset.isFullLoaded = true;
    }
    if (descriptionDOM.textContent === '') return;
    descriptionDOM.classList.remove('hidden');
  }

  static checkNameField(nameField) {
    nameField.addEventListener('input', (e) => {
      if (e.target.value !== '') {
        e.target.classList.remove('input--invalid');
        nameField.removeAttribute('placeholder');
      }
    });
  }

  changeTicketStatus(e) {
    e.preventDefault();
    const switcher = e.target.closest('.ticket__status-switcher');
    const id = switcher.parentElement.dataset.id;
    const statusField = switcher.querySelector('.ticket__status');
    statusField.classList.toggle('hidden');
    this.api.changeTicketStatus(id);
    switcher.blur();
  }

  deleteTicket(e) {
    const id = e.target.parentElement.dataset.id;
    const ticket = this.tickets.find((item) => item.id === id);
    this.api.deleteTicket(id);
    this.tickets = this.tickets.filter((item) => item.id !== id);
    ticket.DOM.remove();

    this.checkTickets(this.tickets, false);
  }

  checkTickets(tickets, isFirst = true) {
    if (tickets.length !== 0) {
      this.app.classList.remove('hidden');
      this.addFormBtn.classList.remove('first-ticket');
      this.addFormBtn.classList.remove('slide-in-top');
      this.addFormBtn.classList.remove('hidden');
    } else {
      this.app.classList.add('hidden');
      this.addFormBtn.classList.add('first-ticket');
      if (!isFirst) this.addFormBtn.classList.add('slide-in-top');
      this.addFormBtn.classList.remove('hidden');
    }
  }

  #renderTickets(tickets) {
    this.ticketsListDOM.innerHTML = '';
    this.checkTickets(tickets);
    tickets.forEach((item) => {
      const date = new Date(item.created).toLocaleString('ru', {
        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
      }).replace(/,/g, '');
      const dateISO = new Date(item.created).toISOString();
      const ticket = document.createElement('li');
      ticket.dataset.id = item.id;
      ticket.classList.add('tickets-list__item', 'ticket');
      ticket.innerHTML = `<button class="ticket__status-switcher btn-s" data-id=""><span class="ticket__status hidden">✓</span></button>
      <span class="ticket__name">${item.name}</span>
      <time class="ticket__date" datetime='${dateISO}'>${date}</time>
      <button class="ticket__edit btn-s">✎</button>
      <button class="ticket__delete btn-s">&#9587;</button>
      <pre class="ticket__description hidden"></pre>`;
      if (item.status) ticket.querySelector('.ticket__status').classList.remove('hidden');
      this.ticketsListDOM.append(ticket);
      this.tickets.push({ id: item.id, DOM: ticket });
    });
  }

  static getNameField(form) {
    return form.querySelector('.input');
  }

  static getDescriptionField(form) {
    return form.querySelector('.textarea');
  }

  addEventListeners(ticket) {
    ticket.onclick = this.openTicketFull.bind(this);
    ticket.querySelector('.ticket__delete').onclick = this.deleteTicket.bind(this);
    ticket.querySelector('.ticket__edit').onclick = this.editFormOpen.bind(this);
    ticket.querySelector('.ticket__status-switcher').onclick = this.changeTicketStatus.bind(this);
  }
}
