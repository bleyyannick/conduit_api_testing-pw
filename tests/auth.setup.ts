import { test as setup, expect } from '@playwright/test'
import fs from 'fs'
import user from '../.auth/user.json'
import process from 'process'



const authFile = '.auth/user.json'


setup('setup', async ({ request }) => { 
  
   const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { 
        "user": {
            "email": process.env.EMAIL,
            "password": process.env.PASSWORD
     }}
  });
  
  const responseBody = await response.json();
  if (response.status() !== 200) {
    console.error("Erreur API :", response.status(), responseBody);
 }

  expect(response.status()).toBe(200);
  const token = responseBody.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user));
  process.env['ACCESS_TOKEN'] = token; 

}); 