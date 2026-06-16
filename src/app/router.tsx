import { createHashRouter } from 'react-router-dom';
import { appRoutes } from './routes';

export const router = createHashRouter(appRoutes);
