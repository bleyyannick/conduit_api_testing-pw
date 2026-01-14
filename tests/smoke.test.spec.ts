import { test } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';

test('smoke test for getting tags', async ({  }) => {
  const api = new RequestHandler()
    .url('https://conduit-api.bondaracademy.com')
    .path('/articles')
    .params({ limit: 5, offset: 0 })
    .headers({
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    });
});