import ApiController from './ApiController';
import AppController from './AppController';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  const apiController = new ApiController(app);
  const appController = new AppController(apiController, app);
  appController.init();
});
