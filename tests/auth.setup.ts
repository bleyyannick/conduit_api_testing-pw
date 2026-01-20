import fs from 'fs'
import user from '../.auth/user.json'
import process from 'process'
import { test } from '../utils/fixtures'

const authFile = '.auth/user.json'

test('setup', async ({ api }) => { 
   const response = await api
    .url('https://conduit-api.bondaracademy.com/api/users/login')
    .body(
      {
        "user": {
            "email": process.env.EMAIL,
            "password": process.env.PASSWORD }}
      )
    .post(200);


  const token = response.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user));
  process.env['ACCESS_TOKEN'] = token; 

}); 