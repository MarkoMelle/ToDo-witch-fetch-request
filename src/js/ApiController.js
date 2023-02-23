import fetchRequest from './fetchRequest';

export default class ApiController {
  constructor() {
    this.loadingSpinner = document.querySelector('.loading-spinner');
    this.url = 'http://localhost:7070/?';
  }

  getAllTickets() {
    // Задержка ответа
    const response = new Promise((resolve) => {
      const serverRes = fetchRequest(this.url, { method: 'allTickets' }, 'GET', {
        'Content-Type': 'application/json;charset=utf-8',
      });
      setTimeout(() => {
        resolve(serverRes);
      }, 2000);
    }).then((serverRes) => {
      this.loadingSpinner.classList.add('hidden');
      return serverRes;
    });
    return response;
  }

  ticketById(id) {
    const response = fetchRequest(this.url, { method: 'ticketById', id }, 'GET', {
      'Content-Type': 'application/json;charset=utf-8',
    });
    return response;
  }

  createTicket(name, description) {
    const response = fetchRequest(this.url, { method: 'createTicket', name, description }, 'POST', {
      'Content-Type': 'application/json;charset=utf-8',
    });
    return response;
  }

  editTicket(id, name, description) {
    const response = fetchRequest(this.url, {
      method: 'editTicket', id, name, description,
    }, 'PATCH', {
      'Content-Type': 'application/json;charset=utf-8',
    });
    return response;
  }

  changeTicketStatus(id) {
    fetchRequest(this.url, { method: 'changeTicketStatus', id }, 'PATCH');
  }

  deleteTicket(id) {
    const response = fetchRequest(this.url, { method: 'deleteTicket', id }, 'DELETE', {
      'Content-Type': 'application/json;charset=utf-8',
    });
    return response;
  }
}
