// export const baseUrl = process.env.SERVER_URL;
//export const baseUrl = '192.168.85.22:8080';
export const baseUrl = 'localhost:8080';
//export const baseUrl = '192.168.149.22:8080'; //bobert
//export const baseUrl = '172.25.13.26:8080';  //faculta fsega
//export const baseUrl = '172.30.114.252:8080';  //faculta mateinfo


export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);

const log = getLogger('api');

export interface ResponseProps<T> {
    data: T;
}

export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            log(`${fnName} - failed - ${err}`);

            if (err.response) {
                // The error is from the server response
                console.error(`${fnName} - ${err.response.status}`); // Log the HTTP status code
                console.error(`${fnName} - ${err.response.data}`); // Log the response data
            } else if (err.request) {
                // The error occurred during the request
                console.error(err.request.getAllResponseHeaders())
            } else {
                // Other types of errors
                console.error(`${fnName} - ${err.message}`); // Log the error message
            }

            console.error(`${fnName} - ${JSON.stringify(err)}`); // Log the request configuration
            return Promise.reject(err);
        });
}

export const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const authConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
});
