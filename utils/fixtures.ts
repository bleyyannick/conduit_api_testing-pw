import { test as base } from '@playwright/test'
import { RequestHandler } from './request-handler'

type RequestFixtures = {
    api: RequestHandler
}

export const test = base.extend<RequestFixtures>({
    api: async ({ }, use) => {
        const requestHandler  = new RequestHandler()
        await use(requestHandler);     
    }
})