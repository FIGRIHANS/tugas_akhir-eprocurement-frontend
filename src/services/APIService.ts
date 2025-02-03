import axios, { type AxiosResponse, Axios } from 'axios'
import type { ApiServiceParams } from './types/api'

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description Initialize api service
   */
  private static axios: Axios = axios.create({ responseType: 'json' })

  /**SECTION - Helpers function */
  /**
   * Handles errors that occur during API requests.
   *
   * @private
   * @param {unknown} error - The error object that was thrown.
   * @description This method checks if the error is an Axios error and logs the error message and response data.
   * If the error is not an Axios error, it logs the error as an unexpected error.
   */
  private static errorHandling(error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error: ${error.message}`, error.response?.data)
      throw error
    }

    console.error(`Unexpected error: ${error}`)
  }

  /**
   * Retrieves access token for API requests.
   *
   * @returns {Promise<string>} A promise that resolves to the access token.
   *
   * @throws {Error} If there is an issue with initializing MSAL or retrieving the access token.
   */
  private static async getAccessToken() {
    return await 'Access Token'
  }
  /**!SECTION - Helpers function */

  /**SECTION - HTTP Request: BASE */
  /**
   * Sets the default headers for Axios requests.
   *
   * This method retrieves an access token using the `getAccessToken` method from `ApiService`
   * and sets the default 'Content-Type' and 'Authorization' headers for all Axios requests.
   *
   * @throws Will log an error to the console if there is an issue retrieving the access token or setting the headers.
   *
   * @example
   * ```typescript
   * await ApiService.setHeader();
   * ```
   */
  public static async setHeader() {
    try {
      const accessToken = await ApiService.getAccessToken()

      ApiService.axios.defaults.headers.common['Content-Type'] = 'application/json'
      ApiService.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      ApiService.axios.defaults.responseType = 'json'
    } catch (error) {
      console.error('Error setting headers', error)
    }
  }

  /**
   * Sends a GET request to the specified endpoint with the given request configuration.
   *
   * @param params - An object containing the endpoint and request configuration.
   * @param params.endpoint - The URL endpoint to send the GET request to.
   * @param params.config - The Axios request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails.
   */
  public static async get(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeader()
      return await ApiService.axios.get(params.endpoint, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService get: ${error}`)
    }
  }

  /**
   * Sends a POST request to the specified endpoint with the given request configuration.
   *
   * @param params - The parameters for the API service, including the endpoint and request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails, with the error message prefixed by 'ApiService post'.
   */
  public static async post(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeader()
      return await ApiService.axios.post(params.endpoint, params?.data || {}, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService post: ${error}`)
    }
  }

  /**
   * Sends a PUT request to the specified endpoint with the given request configuration.
   *
   * @param params - The parameters for the API service, including the endpoint and request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails, with the error message prefixed by 'ApiService
   */
  public static async put(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeader()
      return await ApiService.axios.put(params.endpoint, params?.data || {}, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService put: ${error}`)
    }
  }

  /**
   * Sends a DELETE request to the specified endpoint with the given request configuration.
   *
   * @param params - The parameters for the API service, including the endpoint and request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails, with the error message prefixed by 'ApiService delete'.
   */
  public static async delete(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeader()
      return await ApiService.axios.delete(params.endpoint, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService delete: ${error}`)
    }
  }
  /**!SECTION - HTTP Request: BASE */

  /**SECTION - HTTP Request: FILE */
  /**
   * Sets the headers for file upload requests.
   *
   * This method configures the Axios instance to use the 'multipart/form-data' content type,
   * sets the 'Authorization' header with a Bearer token, and sets the response type to 'arraybuffer'.
   *
   * @returns {Promise<void>} A promise that resolves when the headers are set.
   * @throws Will log an error to the console if there is an issue retrieving the access token or setting the headers.
   */
  public static async setHeaderFile(): Promise<void> {
    try {
      const accessToken = await ApiService.getAccessToken()

      ApiService.axios.defaults.headers.common['Content-Type'] = 'multipart/form-data'
      ApiService.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      ApiService.axios.defaults.responseType = 'arraybuffer'
    } catch (error) {
      console.error('Error setting headers', error)
    }
  }

  /**
   * Sends a GET request to the specified endpoint with the given request configuration.
   *
   * @param params - An object containing the endpoint and request configuration.
   * @param params.endpoint - The URL endpoint to send the GET request to.
   * @param params.config - The Axios request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails.
   */
  public static async getFile(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeaderFile()
      return await ApiService.axios.get(params.endpoint, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService getFile: ${error}`)
    }
  }

  /**
   * Sends a POST request to the specified endpoint with the given request configuration.
   *
   * @param params - The parameters for the API service, including the endpoint and request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails, with the error message prefixed by 'ApiService postFile'.
   */
  public static async postFile(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeaderFile()
      return await ApiService.axios.post(params.endpoint, params?.data || {}, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService postFile: ${error}`)
    }
  }

  /**
   * Sends a PUT request to the specified endpoint with the given request configuration.
   *
   * @param params - The parameters for the API service, including the endpoint and request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails, with the error message prefixed by 'ApiService putFile'.
   */
  public static async putFile(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeaderFile()
      return await ApiService.axios.put(params.endpoint, params?.data || {}, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService putFile: ${error}`)
    }
  }

  /**
   * Sends a DELETE request to the specified endpoint with the given request configuration.
   *
   * @param params - The parameters for the API service, including the endpoint and request configuration.
   * @returns A promise that resolves to the Axios response.
   * @throws Will throw an error if the request fails, with the error message prefixed by 'ApiService deleteFile'.
   */
  public static async deleteFile(params: ApiServiceParams): Promise<AxiosResponse> {
    try {
      await ApiService.setHeaderFile()
      return await ApiService.axios.delete(params.endpoint, params.config)
    } catch (error) {
      ApiService.errorHandling(error)
      throw new Error(`ApiService deleteFile: ${error}`)
    }
  }
  /**!SECTION - HTTP Request: FILE */
}

export default ApiService
