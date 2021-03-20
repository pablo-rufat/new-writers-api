import { Router } from 'express';
import chaptersRouter from './chapter.routes';
import usersRouter from './user.routes';

const routes = Router();

routes.get('/', (request, response) => {
  response.json("OK");
});

routes.use('/users', usersRouter);
routes.use('/chapters', chaptersRouter);

export default routes;