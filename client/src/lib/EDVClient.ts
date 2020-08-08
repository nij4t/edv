const BASE_URL = 'https://localhost'

export function auth(req: AuthRequestBody): Promise<AuthResponse> {
    return fetch(BASE_URL + '/api/v1alpha1/login', {
        method: 'POST',
        body: JSON.stringify(req)
    }).then(resp => resp.json())
}

export function find(req: FindRequest): Promise<FindResponse> {
    return fetch(BASE_URL + '/api/v1/cashback/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...req.headers
        },
        body: JSON.stringify(req.body)
    }).then(resp => resp.json()).then(v => ({ body: v })
    )
}

export interface AuthRequestBody {
    loginMethod: string
    pin: string
    mobile: string
    password: string
}

export interface AuthResponse {
    Body: { token: string }
}

export interface FindRequest {
    headers: {
        "x-access-token": string
    }
    body: {
        id: string
    }
}

export type FindResponse = ReadyFindRespone | ErrorFindResponse

export type PENDING = 400
export type READY = 200

interface ErrorFindResponse {
    body: {
        code: PENDING
        message: string
    }
}

interface ReadyFindRespone {
    body: {
        code: READY
        data: {
            id: number
            fiskalId: string
            insertDate: Date
            buyAmount: {
                value: string
                currency: {
                    code: number
                    name: string
                }
            }
            refundAmount: {
                value: string
                currency: {
                    code: number
                    name: string
                }
            }
            state: string
            chequeStatusMessage: string
        }
    }
}