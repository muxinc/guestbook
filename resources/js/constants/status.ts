export enum Status {
    INITIALIZING = "INITIALIZING", // about to upload
    UPLOADING = "UPLOADING",
    UPLOADED = "UPLOADED",
    PENDING = "PENDING", // uploading from another client
    PREPARING = "PREPARING",
    READY = "READY",
    ERROR = "ERROR",
    UNKNOWN = "UNKNOWN",
}