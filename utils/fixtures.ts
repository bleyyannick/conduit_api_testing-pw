import { test as base } from '@playwright/test'
import { RequestHandler } from './request-handler'
import { APILogger } from './logger'

type RequestFixtures = {
    api: RequestHandler,
    requestLogger: APILogger,
}

export const test = base.extend<RequestFixtures>({
    api: async ({ request}, use) => {
        const logger = new APILogger();
        const requestHandler  = new RequestHandler(request, process.env.API_BASE_URL || '', logger);
        await use(requestHandler);     
    }
})