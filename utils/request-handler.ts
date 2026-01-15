export class RequestHandler {

   private baseUrl: string =''
   private apiPath: string =''
   private defaultURL: string = 'https://conduit-api.bondaracademy.com/api';
   private apiHeaders: Record<string, string> = {};
   private bodyData: any = null;
   private queryParams: Record<string, string | number | boolean> = {};
   
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

    private getURL(): string {
        const url = new URL(`${this.baseUrl || this.defaultURL}${this.apiPath}`);
        Object.entries(this.queryParams).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
        return url.toString();
    };
}