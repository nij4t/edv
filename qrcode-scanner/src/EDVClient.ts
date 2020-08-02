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

export interface FindResponse {
    body: {
        message: string
    }
}