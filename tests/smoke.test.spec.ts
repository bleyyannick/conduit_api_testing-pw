import { expect } from '@playwright/test';
import { test } from '../utils/fixtures';
import { APILogger } from '../utils/logger';

test('smoke test for getting tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .get(200);

  expect(response).toHaveProperty('tags');
  expect(Array.isArray(response.tags)).toBe(true);
  expect(response.tags.length).toBeGreaterThan(0);
  expect(response.tags).toContain('Test');

});

test('logging something', async ({}) => {
   const logger = new APILogger();
    logger.logRequest('GET', 'https://api.example.com/tags', {'Accept': 'application/json'});
    logger.logResponse(200, 'https://api.example.com/tags', {'Content-Type': 'application/json'}, {tags: ['Test', 'Smoke', 'API']});
    const logs = logger.getRecentLogs();
    expect(logs.length).toBe(2);
});

test('smoke test for getting articles', async ({ api }) => {
 const response = await api
              .path('/articles')
              .params({ limit: 6, offset: 0 })
              .get(200);
      expect(response.articles.length).toBe(6);
      expect(response.articlesCount).toBeGreaterThan(0);
});

test('smoke test for creating an article and deleting it', async ({ api }) => {
  const newArticle = {
    article: {
      title: 'The Brand New Smoke Test Article',
      description: 'This is a Brand New Smoke Test article',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tagList: ['smoke', 'test']
    }
  };

  const response = await api
    .path('/articles')
    .headers({ 'Content-Type': 'application/json' })
    .body(newArticle)
    .post(201);

  const slugId = response.article.slug;
  const formattedTagList = response.article.tagList.map((tag: string) => tag.toLowerCase());
  
  expect(slugId).toBeDefined();
  expect(response).toHaveProperty('article');
  expect(response.article.title).toBe(newArticle.article.title);
  expect(response.article.description).toBe(newArticle.article.description);
  expect(response.article.body).toBe(newArticle.article.body);;
  expect(formattedTagList).toEqual(expect.arrayContaining(newArticle.article.tagList));

  const deleteResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ 'Content-Type': 'application/json' })
    .delete();

    expect(deleteResponse).toBeUndefined();
});

test('smoke test for updating an article', async ({ api }) => {
  const newArticle = {
    article: {
      title: 'New Smoke Test The Last One I Hope',
      description: 'This article will be updated in the smoke test again and again',
      body: 'Initial body content for the smoke test article again.',
      tagList: ['smoke', 'update']
    }
  };

  const createResponse = await api
    .path('/articles')
    .headers({ 'Content-Type': 'application/json' })
    .body(newArticle)
    .post(201);

  const slugId = createResponse.article.slug;

  const updatedArticle = {
    article: {
      title: 'Last Update Smoke Test Update Again',
      description: 'This is the updated description for the smoke test article again and again.',
      body: 'Updated body content for the smoke test article again.',
    }
  };

  const updateResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ 'Content-Type': 'application/json' })
    .body(updatedArticle)
    .put(200);  
  expect(updateResponse.article.title).not.toBe(createResponse.article.title);
  expect(updateResponse.article.description).not.toBe(createResponse.article.description);
  expect(updateResponse.article.body).not.toBe(createResponse.article.body);

  const updatedSludgId = updateResponse.article.slug;

  const deleteUpdateResponse = await api
    .path(`/articles/${updatedSludgId}`)
    .headers({ 'Content-Type': 'application/json' })
    .delete();

    expect(deleteUpdateResponse).toBeUndefined();
  
});