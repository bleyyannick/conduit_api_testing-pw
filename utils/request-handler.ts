import { APIRequestContext, expect } from "@playwright/test";

export class RequestHandler {

   private request: APIRequestContext;
   private baseUrl: string =''
   private apiPath: string =''
   private defaultURL: string = '';
   private apiHeaders: Record<string, string> = {};
   private bodyData: any = null;
   private queryParams: Record<string, string | number | boolean> = {};


   constructor( request: APIRequestContext, apiBaseUrl: string) {
         this.request = request;
         this.defaultURL = apiBaseUrl;
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
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(statusCode);
        return responseBody;
        
    }

    async post(statusCode: number = 201) {
        const url = this.getURL();
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.bodyData
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(statusCode);
        return responseBody;
    }

    async put(statusCode: number = 200) {
        const url = this.getURL();
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.bodyData
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(statusCode);
        return responseBody;
    }

    async delete(statusCode: number = 204) {
        const url = this.getURL();
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });
        expect(response.status()).toBe(statusCode);
        return;
    }


    private getURL(): string {
        const url = new URL(`${this.baseUrl || this.defaultURL}${this.apiPath}`);
        Object.entries(this.queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
        return url.toString();
    };
}