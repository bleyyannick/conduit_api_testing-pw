import { test } from '../utils/fixtures';

test('smoke test for getting tags', async ({ api }) => {
  api
    .path('/articles')
    .params({ limit: 5, offset: 0 })
    .headers({
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    });
});