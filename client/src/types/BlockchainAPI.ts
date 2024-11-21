export type Pagination = {
  pageNumber: number
  pageSize: number
}

export type MetadataEntry = {
  compositeHash: string
  metadataType: number
  scopedMetadataKey: string
  sourceAddress: string
  targetAddress: string
  targetId: string
  value: string
  valueSize: number
  version: number
}

export type MetadataResponse = {
  pagination: Pagination
  data: {
    id: string
    metadataEntry: MetadataEntry
  }[]
}

export type Header = {
  version: number
  reserve: number
  length: number
  metadataOffset: number
  payloadOffset: number
}

export type DataItem = {
  fileIndex: string
  valueIndex: string
  value: string
}
