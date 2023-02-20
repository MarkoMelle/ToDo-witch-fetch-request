import fetchRequest from "./fetchRequest";

const app = document.querySelector('#app');

const ticketsList = app.querySelector('.tickets-list')
const tickets = []

export default async function getAllTickets() {
   let response = await fetchRequest('http://localhost:7070/?', { method: 'allTickets' }, 'GET', {
      'Content-Type': 'application/json;charset=utf-8'
   });

   response.forEach(item => {
      const date = new Date(item.created).toLocaleString("ru", { 'day': '2-digit', 'month': '2-digit', 'year': '2-digit', 'hour': '2-digit', 'minute': '2-digit'}).replace(/\,/g,'');
      const dateISO = new Date(item.created).toISOString();

      const ticket = document.createElement('li')
      ticket.classList.add('tickets-list__item', 'ticket');
      ticket.innerHTML = `<button class="ticket__status btn-s">✓</button>
   <span class="ticket__name">${item.name}</span>
   <time class="ticket__date" datetime='${dateISO}'>${date}</time>
   <button class="ticket__edit btn-s">✎</button>
   <button class="ticket__delete btn-s">&#9587;</button>
   <p class="ticket__description hidden"></p>`
      console.log(ticket)
      ticketsList.append(ticket)
      tickets.push(ticket)
      
   });
}
