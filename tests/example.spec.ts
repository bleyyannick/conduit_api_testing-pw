import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  // JUST to check that env variables are loaded
  console.log('API Base URL:', process.env.API_BASE_URL);
  console.log('Access Token:', process.env.ACCESS_TOKEN);
});

test('get tags', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const responseBody = await response.json();
  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty('tags');
  expect(responseBody.tags).toContain('Git');
});

test('get articles', async ({ request }) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('articles');
  expect(responseBody.articles.length).toBeGreaterThan(0);
});

test('create an article', async ({ request }) => {
  const newArticle = {
    article: {
      title: "Trying to create an article via API",
      description: "Test Description",
      body: "on reessaye en esperant que ca marche qsildqshODIJHIOQSjdj",
      tagList: ["Playwright", "API", "Testing", "Test", "article"]
    }
  };

  const response = await request.post(`${process.env.API_BASE_URL}/articles`, {
    data: newArticle
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  expect(responseBody.article.tagList).toContain('Test');
  expect(responseBody.article.tagList).toContain('article');
});

test('create and delete an article', async ({ request }) => {
  // Create an article
  const newArticle = {
    article: {
      title: "No problem for this test",
      description: "This article will be created and then deleted",
      body: "Test body for create and delete operation",
      tagList: ["Test", "delete"]
    }
  };

  const createResponse = await request.post(`${process.env.API_BASE_URL}/articles`, {
    data: newArticle
  });

  expect(createResponse.status()).toBe(201);
  const createResponseBody = await createResponse.json();
  expect(createResponseBody.article).toHaveProperty('slug');
  expect(createResponseBody.article.title).toBe(newArticle.article.title);
  expect(createResponseBody.article.body).toBe(newArticle.article.body);
  expect(createResponseBody.article.tagList).toEqual(expect.arrayContaining(['Test', 'delete']));

  const articleSlug = createResponseBody.article.slug;
  console.log(`Article created with slug: ${articleSlug}`);

  const deleteResponse = await request.delete(`${process.env.API_BASE_URL}/articles/${articleSlug}`, {
  });
  expect(deleteResponse.status()).toBe(204);
  const getResponse = await request.get(`${process.env.API_BASE_URL}/articles/${articleSlug}`);
  expect(getResponse.status()).toBe(404);
});

test('update an article', async ({ request }) => {
  const newArticle = {
    article: {
      title: "AGAIN ETC AGAIN",
      description: "This article will be created and then updated",
      body: "Initial body content",
      tagList: ["Update", "Test"]
    }
  };

  const createResponse = await request.post(`${process.env.API_BASE_URL}/articles`, {
    data: newArticle
  });

  expect(createResponse.status()).toBe(201);
  const createResponseBody = await createResponse.json();
  const articleSlug = createResponseBody.article.slug;


  const updatedArticle = {
    article: {
      title: "ETC MAX B IS OUT ! WITH FRENCH MONTANA ",
      description: "This article has been updated",
      body: "Updated body content",
      tagList: ["Updated", "Test"]
    }
  };

  const updateResponse = await request.put(`${process.env.API_BASE_URL}/articles/${articleSlug}`, {
    data: updatedArticle
  });

  expect(updateResponse.status()).toBe(200);
  const updateResponseBody = await updateResponse.json();
  expect(updateResponseBody.article.title).toBe(updatedArticle.article.title);
  expect(updateResponseBody.article.body).toBe(updatedArticle.article.body);
  expect(updateResponseBody.article.tagList).toEqual(expect.arrayContaining(['Updated', 'Test']));

  // Clean up by deleting the article
  const deleteResponse = await request.delete(`${process.env.API_BASE_URL}/articles/${articleSlug}`);
  const allArticles = await request.get(`${process.env.API_BASE_URL}/articles?limit=100&offset=0`);
  const allArticlesBody = await allArticles.json();
  const articleExists = allArticlesBody.articles.some((article: any) => article.slug === articleSlug);
  expect(articleExists).toBeFalsy();
});