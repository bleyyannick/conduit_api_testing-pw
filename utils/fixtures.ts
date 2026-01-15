import { test as base } from '@playwright/test'
import { RequestHandler } from './request-handler'

type RequestFixtures = {
    api: RequestHandler
}

export const test = base.extend<RequestFixtures>({
    api: async ({ request}, use) => {
        const requestHandler  = new RequestHandler(request, process.env.API_BASE_URL || '');
        await use(requestHandler);     
    }
})