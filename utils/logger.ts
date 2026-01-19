export class APILogger { 

    private recentLogs: any[] = [];
    
    logRequest(method: string, url: string, headers: Record<string, string>, body?: any) {
        const logEntry = {method, url, headers, body: body ?? JSON.stringify(body)};
        this.recentLogs.push(logEntry);
        console.log(logEntry);
    }

    logResponse(status: number, url: string, headers: Record<string, string>, body?: any) {
        const logEntry = `Response - Status: ${status}, url: ${url}, Headers: ${JSON.stringify(headers)}, Body: ${JSON.stringify(body)}`;
        this.recentLogs.push(logEntry);
        console.log(logEntry);
        console
    }

    getRecentLogs(): string[] {
       const formattedLogs = this.recentLogs.map(log => JSON.stringify(log));
       return formattedLogs;
    }


}