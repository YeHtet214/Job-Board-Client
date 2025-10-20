// api.service.ts
import { AxiosInstance, AxiosResponse } from 'axios'
import axios from './index'

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
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

        console.log('is it formm data: ', isFormData)
        return isFormData
            ? customHeaders
            : { 'Content-Type': 'application/json', ...customHeaders }
    }

    protected get<T>(url: string): Promise<AxiosResponse<ApiResponse<T>>> {
        return this.api.get<ApiResponse<T>>(url)
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
        /*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Make a PUT request to the specified URL
         * @param url The URL of the request
         * @param data The data to send with the request
         * @param config Optional configuration for the request
         * @returns A promise that resolves with the response of the request
         */
        /*******  f0e49faa-1a73-4179-98d8-a7dbbabf4fbd  *******/ url: string,
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
