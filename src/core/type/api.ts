export interface ApiResponse<ContentType = unknown> {
  data: ApiResponseData<ContentType>
}

export interface ApiResponseData<ContentType = unknown> {
  title: string
  statusCode: number
  result: ApiResponseDataResult<ContentType>
}

export interface ApiResponseDataResult<ContentType = unknown> {
  message: string
  isError: boolean
  content: ContentType
}
