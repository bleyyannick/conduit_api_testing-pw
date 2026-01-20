import { expect } from '@playwright/test';
import { test } from '../utils/fixtures';

test('get tags', async ({ api }) => {
  const response = await api
    .url(`${process.env.API_BASE_URL}/tags`)
    .get(200);
  
  expect(response).toHaveProperty('tags');
  expect(response.tags).toContain('Git');
});


test('create an article', async ({ api }) => {
  const newArticle = {
    article: {
      title: "LAST TRY THEN I GIVE UP",
      description: "Test Description",
      body: "on reessaye en esperant que ca marche qsildqshODIJHIOQSjdj",
      tagList: ["Playwright", "API", "Testing", "Test", "article"]
    }
  };

  const response = await api
    .url(`${process.env.API_BASE_URL}/articles`)
    .body(newArticle)
    .post(201)

    expect(response.article.tagList).toContain('Test');
    expect(response .article.tagList).toContain('article');

  const deleteResponse = await api
    .url(`${process.env.API_BASE_URL}/articles/${response.article.slug}`)
    .delete(204);
});

test('create and delete an article', async ({ api }) => {

  const newArticle = {
    article: {
      title: "another one Test of creating an article to delete via API",
      description: "This article will be created and then deleted",
      body: "Test body for create and delete operation",
      tagList: ["Test", "delete"]
    }
  };

  const createResponse = await api
    .url(`${process.env.API_BASE_URL}/articles`)
    .body(newArticle)
    .post(201);


  expect(createResponse.article).toHaveProperty('slug');
  expect(createResponse.article.title).toBe(newArticle.article.title);
  expect(createResponse.article.body).toBe(newArticle.article.body);
  expect(createResponse.article.tagList).toEqual(expect.arrayContaining(['Test', 'delete']));

  const articleSlug = createResponse.article.slug;
  console.log(`Article created with slug: ${articleSlug}`);

  const deleteResponse = await api
      .url(`${process.env.API_BASE_URL}/articles/${articleSlug}`)
      .delete(204);

  const getResponse = await api
      .url(`${process.env.API_BASE_URL}/articles/${articleSlug}`)
      .get(404);
});

test('update an article', async ({ api }) => {
  const newArticle = {
    article: {
      title: " KLSJQFHBNJKLSQfkljqkmdsjkfmkjmI",
      description: "This article will be created and then updated",
      body: "Initial body content",
      tagList: ["Update", "Test"]
    }
  };

  const createResponse = await api
    .url(`${process.env.API_BASE_URL}/articles`)
    .body(newArticle)
    .post(201);

    const articleSlug = createResponse.article.slug;


  const updatedArticle = {
    article: {
      title: "BOWAAAAH ",
      description: "This article has been updated",
      body: "Updated body content",
      tagList: ["Updated", "Test"]
    }
  };

  const updateResponse = await api
   .url(`${process.env.API_BASE_URL}/articles/${articleSlug}`)
   .body(updatedArticle)
   .put(200);
  
  expect(updateResponse.article.title).toBe(updatedArticle.article.title);
  expect(updateResponse.article.body).toBe(updatedArticle.article.body);
  expect(updateResponse.article.tagList).toEqual(expect.arrayContaining(['Updated', 'Test']));

  const updateSlug = updateResponse.article.slug;

  const deleteResponse = await api
    .url(`${process.env.API_BASE_URL}/articles/${updateSlug}`)
    .delete(204);

  const allArticles = await api
    .url(`${process.env.API_BASE_URL}/articles`)
    .params({ limit: 10, offset: 0 })
    .get(200);

  const allArticlesBody = allArticles;
  const articleExists = allArticlesBody.articles.some((article: any) => article.slug === updateSlug);

  expect(articleExists).toBeFalsy();
});