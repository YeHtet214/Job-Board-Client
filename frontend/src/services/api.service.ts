import { AxiosInstance, AxiosResponse } from 'axios'
import axios from './index'

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    meta?: {
        currentPage: number
        totalCount: number
        totalPages: number
    }
}

export class ApiService {
    protected api: AxiosInstance

    constructor() {
        this.api = axios
    }
    protected resolveHeaders(data: any, customHeaders = {}) {
        // Don't manually set Content-Type for FormData
        const isFormData =
            typeof FormData !== 'undefined' && data instanceof FormData

        return isFormData
            ? customHeaders
            : { 'Content-Type': 'application/json', ...customHeaders }
    }

    protected get<T>(
        url: string,
        config: any = {}
    ): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.api.get<ApiResponse<T>>(url, config)
    }

    protected post<T>(
        url: string,
        data: any,
        config: any = {}
    ): Promise<AxiosResponse<ApiResponse<T>>> {
        const headers = this.resolveHeaders(data, config?.headers || {})
        return this.api.post<ApiResponse<T>>(url, data, { ...config, headers })
    }

    protected put<T>(
        url: string,
        data: any,
        config: any = {}
    ): Promise<AxiosResponse<ApiResponse<T>>> {
        const headers = this.resolveHeaders(data, config?.headers || {})
        return this.api.put<ApiResponse<T>>(url, data, { ...config, headers })
    }

    protected delete<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.api.delete<ApiResponse<T>>(url)
    }
}
