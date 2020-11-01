export class EDVClient {
    private baseUrl: string

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || "https://localhost"
    }

    public auth(req: AuthRequestBody): Promise<AuthResponse> {
        return fetch(this.baseUrl + '/api/v1alpha1/login', {
            method: 'POST',
            body: JSON.stringify(req)
        }).then(resp => resp.json())
    }

    public find(req: FindRequest): Promise<FindResponse> {
        return fetch(this.baseUrl + '/api/v1/cashback/find', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...req.headers
            },
            body: JSON.stringify(req.body)
        }).then(resp => resp.json()).then(v => ({ body: v })
        )
    }

    public refund(req: RefundRequest): Promise<RefundResponse> {
        return fetch(this.baseUrl + '/api/v1/cashback/refund', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...req.headers
            },
            body: JSON.stringify(req.body)
        }).then(resp => resp.json()).then(v => ({ body: v })
        )
    }

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
        // Fiskal ID
        id: string
    }
}

export type FindResponse = ReadyFindRespone | ErrorFindResponse

export type PENDING = 400 | 406
export type READY = 200

interface ErrorFindResponse {
    body: {
        code: PENDING
        message: string
    }
}

export interface ReadyFindRespone {
    body: {
        code: READY
        data: Cashback
    }
}

export interface Cashback {
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

export interface RefundRequest {
    headers: {
        "x-access-token": string
    }
    body: {
        id: number
    }
}

export interface RefundResponse {
    body: {
        code: READY
        data: {
            id: number
            message: string
        }
    }
}