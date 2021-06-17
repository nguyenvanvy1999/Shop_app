import { App } from './app';
import { accountRoute } from './core/account/routes';
import { categoryRoute } from './core/category/routes';
import { productRoute } from './core/product/routes';

const app = new App([productRoute, accountRoute, categoryRoute]);

app.listen();
