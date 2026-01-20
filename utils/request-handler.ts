import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
    
   private request: APIRequestContext;
   private baseUrl: string =''
   private apiPath: string =''
   private defaultURL: string = '';
   private apiHeaders: Record<string, string> = {};
   private bodyData: any = null;
   private logger: APILogger;
   private queryParams: Record<string, string | number | boolean> = {};


   constructor( request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
         this.request = request;
         this.defaultURL = apiBaseUrl;
         this.logger = logger;
   }
   
    url(url: string) {
        this.baseUrl = url;
        return this;
    }
    
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }
    
    body(data: any) {
        this.bodyData = data;
        return this;
    }
    
    params(params: Record<string, string | number | boolean>) {
        this.queryParams = params;
        return this;
    }
    
    path(path: string) {
        this.apiPath = path;
        return this;
    }
    

    async get(statusCode: number = 200) {
        const url = this.getURL();
        this.logger.logRequest('GET', url, this.apiHeaders);
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });
        this.clearFields();
        const responseBody = await response.json();
        const currentStatusCode = response.status();
        this.logger.logResponse(currentStatusCode, url, this.apiHeaders, responseBody);
        this.statusCodeValidator(currentStatusCode, statusCode, this.get);
        return responseBody;
        
    }

    async post(statusCode: number = 201) {
        const url = this.getURL();
        this.logger.logRequest('POST', url, this.apiHeaders, this.bodyData);
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.bodyData
        });
        this.clearFields();
        const responseBody = await response.json();
        const currentStatusCode = response.status();
        this.logger.logResponse(currentStatusCode, url, this.apiHeaders, responseBody);
        this.statusCodeValidator(currentStatusCode, statusCode, this.post);
        return responseBody;
    }

    async put(statusCode: number = 200) {
        const url = this.getURL();
        this.logger.logRequest('PUT', url, this.apiHeaders, this.bodyData);
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.bodyData
        });
        this.clearFields();
        const responseBody = await response.json();
        const currentStatusCode = response.status();
        this.logger.logResponse(currentStatusCode, url, this.apiHeaders, responseBody);
        this.statusCodeValidator(currentStatusCode, statusCode, this.put);
        return responseBody;
    }

    async delete(statusCode: number = 204) {
        const url = this.getURL();
        this.logger.logRequest('DELETE', url, this.apiHeaders);
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });
        this.clearFields();
        const currentStatusCode = response.status();
        this.logger.logResponse(currentStatusCode, url, this.apiHeaders);
        this.statusCodeValidator(currentStatusCode, statusCode, this.delete);
        return;
    }


    private getURL(): string {
        const url = new URL(`${this.baseUrl || this.defaultURL}${this.apiPath}`);
        Object.entries(this.queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
        return url.toString();
    };


    private statusCodeValidator(responseStatus: number, expectedStatus: number, method: Function) {
        expect(responseStatus).toBe(expectedStatus);
        if (responseStatus !== expectedStatus) {
            this.logger.getRecentLogs();
            const error = new Error(`Expected status code ${expectedStatus}, but got ${responseStatus}`);
            Error.captureStackTrace(error, method)
            throw error;
        }
        
    }

    private clearFields() {
        this.apiPath = '';
        this.apiHeaders = {};
        this.bodyData = null;
        this.queryParams = {};
    }
}