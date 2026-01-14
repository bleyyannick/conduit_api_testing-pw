import { test as setup, expect } from '@playwright/test'
import fs from 'fs'
import user from '../.auth/user.json'
import process from 'process'



const authFile = '.auth/user.json'


setup('setup', async ({ page, request }) => { 
  // await page.goto('https://conduit.bondaracademy.com/');
  // await page.locator('a.nav-link').getByText('Sign in').click();
  // await page.getByPlaceholder('Email').fill('yussuf@gmail.com');
  // await page.getByPlaceholder('Password').fill('yannick92');
  // await page.getByRole('button', { name: 'Sign in' }).click();

  // await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");
  // await page.context().storageState({ path: authFile });

   const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { 
        "user": {
            "email": process.env.EMAIL,
            "password": process.env.PASSWORD
     }}
  });
  
  const responseBody = await response.json();
  console.log(responseBody);
  if (response.status() !== 200) {
    console.error("Erreur API :", response.status(), responseBody);
}
  expect(response.status()).toBe(200);
  const token = responseBody.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user));
  process.env['ACCESS_TOKEN'] = token;
 

}); 